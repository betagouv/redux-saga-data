import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export const GLOBAL_RESULT_ERROR = 'Result returned by the server is not at the good json format'

export function *handleResultError (config) {
  const globalResultError = config.globalResultError || GLOBAL_RESULT_ERROR
  const { handleFail } = config

  const errors = [
    {
      global: [globalResultError],
    },
  ]

  const payload = { errors }
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const failAction = { config, payload }
    yield call(handleFail, state, failAction)
  }

  throw Error(errors)
}

export default handleResultError
