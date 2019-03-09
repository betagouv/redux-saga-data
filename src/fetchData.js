import uuid from 'uuid'

const { NAME, VERSION } = process.env

const successStatusCodes = [200, 201, 202, 203, 205, 206, 207, 208, 210, 226]

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
    status,
  }

  if (successStatusCodes.includes(status)) {

    if (window.cordova) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    }

    // warn
    if (!fetchResult.json) {
      console.warn(
        `fetch is a success but expected a json format for the fetchResult of ${url}`
      )
      result.errors = [
        {
          global: ['Le serveur ne renvoit pas de la donnée au bon format'],
        },
      ]
      return result
    }

    result.data = await fetchResult.json()
    return result
  }

  if (status === 204) {
    result.data = {}
    return result
  }

  if (!fetchResult.json) {
    console.warn(
      `fetch returns ${status} but we still expected a json format for the fetchResult of ${url}`
    )
    result.errors = [
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
