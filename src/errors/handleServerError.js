import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export const GLOBAL_SERVER_ERROR = 'Server error. Try to to refresh the page.'

export function *handleServerError (error, config) {
  const globalServerError = config.globalServerError || GLOBAL_SERVER_ERROR
  const { handleFail } = config

  Object.assign(config, { ok: false, status: 500 })
  const errors = [
    {
      global: [globalServerError],
    },
    {
      data: [String(error)],
    },
  ]
  const payload = { errors }
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const failAction = { config, payload  }
    yield call(handleFail, state, failAction)
  }
}

export default handleServerError
