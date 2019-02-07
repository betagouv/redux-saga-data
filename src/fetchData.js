import uuid from 'uuid'

const { NAME, VERSION } = process.env

const successStatusCodes = [200, 201, 202, 203, 205, 206, 207, 208, 210, 226]

export async function fetchData(method, path, config = {}) {
  const { body, token, url } = config

  const init = {
    credentials: 'include',
    method,
  }

  init.headers = {
    AppName: NAME,
    AppVersion: VERSION,
    'X-Request-ID': uuid(),
  }

  if (method && method !== 'GET' && method !== 'DELETE') {
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

  // token
  if (token) {
    if (!init.headers) {
      init.headers = {}
    }
    init.headers.Authorization = `Bearer ${token}`
  }

  // fetch
  const fetchUrl = `${url}/${path.replace(/^\//, '')}`
  const fetchResult = await fetch(fetchUrl, init)

  // prepare result
  const { ok, status } = fetchResult
  const result = {
    ok,
    status,
  }

  // check
  if (successStatusCodes.includes(status)) {
    // TODO: do we need that here precisely ?
    if (window.cordova) {
      window.cordova.plugins.CookieManagementPlugin.flush()
    }

    // warn
    if (!fetchResult.json) {
      console.warn(
        `fetch is a success but expected a json format for the fetchResult of ${fetchUrl}`
      )
      result.errors = [
        {
          global: ['Le serveur ne renvoit pas de la donnée au bon format'],
        },
      ]
      return result
    }

    // success with data
    result.data = await fetchResult.json()
    return result
  }

  // special 204
  if (status === 204) {
    result.data = {}
    return result
  }

  // warn
  if (!fetchResult.json) {
    console.warn(
      `fetch returns ${status} but we still expected a json format for the fetchResult of ${fetchUrl}`
    )
    result.errors = [
      {
        global: ['Le serveur ne renvoit pas de la donnée au bon format'],
      },
    ]
    return result
  }

  // fail with errors
  result.errors = await fetchResult.json()
  return result
}

export default fetchData
