import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export const GLOBAL_TIMEOUT_ERROR = 'Server timeout'

export function* handleTimeoutError(config) {
  const globalTimeoutError = config.globalTimeoutError || GLOBAL_TIMEOUT_ERROR
  const { handleFail } = config

  const errors = [
    {
      global: [globalTimeoutError],
    },
  ]

  const payload = {
    errors,
    ok: false,
    status: 504,
  }
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const failAction = { config, payload }
    yield call(handleFail, state, failAction)
  }

  throw Error(errors)
}

export default handleTimeoutError
