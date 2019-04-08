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

  yield put(failData({ errors }, config))

  if (handleFail) {
    const state = yield select(s => s)
    handleFail(state, { payload: { errors } })
  }

  throw Error(errors)
}

export default handleTimeoutError
