import uuid from 'uuid'

import {
  successStatusCodesWithDataOrDatum,
  successStatusCodesWithoutDataAndDatum
} from './status'

const { NAME, VERSION } = process.env

export async function fetchData(url, config = {}) {
  const {
    body,
    method,
    token
  } = config

  const init = {
    credentials: 'include',
    method,
  }

  init.headers = {
    AppName: NAME,
    AppVersion: VERSION,
    'X-Request-ID': uuid(),
  }

  if (method !== 'GET' && method !== 'DELETE') {

    let formatBody = body
    let isFormDataBody = formatBody instanceof FormData
    if (formatBody && !isFormDataBody) {
      const fileValue = Object.values(body).find(value => value instanceof File)
      if (fileValue) {
        const formData = new FormData()
        Object.keys(formatBody).forEach(key => formData.append(key, formatBody[key]))
        formatBody = formData

        isFormDataBody = true
      }
    }

    if (!isFormDataBody) {
      Object.assign(init.headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
    }

    init.body =
      init.headers['Content-Type'] === 'application/json'
        ? JSON.stringify(body || {})
        : body
  }

  if (token) {
    if (!init.headers) {
      init.headers = {}
    }
    init.headers.Authorization = `Bearer ${token}`
  }

  const fetchResult = await fetch(url, init)

  const { ok, status } = fetchResult
  const result = {
    ok,
    payload: {},
    status,
  }

  if (successStatusCodesWithDataOrDatum.includes(status)) {

    if (window.cordova) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    }

    // warn
    if (!fetchResult.json) {
      console.warn(
        `fetch is a success but expected a json format for the fetchResult of ${url}`
      )
      result.payload.errors = [
        {
          global: ['Le serveur ne renvoit pas de la donnée au bon format'],
        },
      ]
      return result
    }

    const dataOrDatum = await fetchResult.json()
    if (Array.isArray(dataOrDatum)) {
      result.payload.data = dataOrDatum
    } else if (typeof dataOrDatum === 'object') {
      result.payload.datum = dataOrDatum
    }

    return result
  }

  if (successStatusCodesWithoutDataAndDatum.includes(status)) {
    return result
  }

  if (!fetchResult.json) {
    console.warn(
      `fetch returns ${status} but we still expected a json format for the fetchResult of ${url}`
    )
    result.payload.errors = [
      {
        global: ['Le serveur ne renvoit pas de la donnée au bon format'],
      },
    ]
    return result
  }

  result.errors = await fetchResult.json()
  return result
}

export default fetchData
