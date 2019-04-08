import { failData } from 'fetch-normalize-data'
import { put, select } from 'redux-saga/effects'

export const GLOBAL_RESULT_ERROR = 'Result returned by the server is not at the good json format'

export function *handleResultError (config) {
  const globalResultError = config.globalResultError || GLOBAL_RESULT_ERROR
  const { handleFail } = config

  const errors = [
    {
      global: [globalResultError],
    },
  ]

  yield put(failData({ errors }, config))

  if (handleFail) {
    const state = yield select(s => s)
    handleFail(state, { payload: { errors } })
  }

  throw Error(errors)
}

export default handleResultError
