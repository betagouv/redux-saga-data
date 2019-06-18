import { failData } from 'fetch-normalize-data'
import { put, select } from 'redux-saga/effects'

export const GLOBAL_TIMEOUT_ERROR = 'Server timeout'

export function *handleTimeoutError (config) {
  const globalTimeoutError = config.globalTimeoutError || GLOBAL_TIMEOUT_ERROR
  const { handleFail } = config

  const errors = [
    {
      global: [globalTimeoutError],
    },
  ]

  const payload = { errors }
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const failAction = { config, payload }
    handleFail(state, failAction)
  }

  throw Error(errors)
}

export default handleTimeoutError
