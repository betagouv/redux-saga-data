import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'
import { SERVER_ERROR } from '../error_codes'

export const GLOBAL_SERVER_ERROR = 'Server error. Try to to refresh the page.'

export function* handleServerError(error, config) {
  const globalServerError = config.globalServerError || GLOBAL_SERVER_ERROR
  const { handleFail } = config
  const errors = [
    {
      global: [globalServerError],
    },
    {
      data: [String(error)],
    },
  ]
  const payload = {
    errors,
    ok: false,
    status: 500,
    error_type: SERVER_ERROR,
  }
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const failAction = { config, payload }
    yield call(handleFail, state, failAction)
  }
}

export default handleServerError
