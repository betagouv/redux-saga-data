import { failData } from 'fetch-normalize-data'
import { put, select } from 'redux-saga/effects'

export function *handleApiError(payload, config) {
  const { handleFail } = config

  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const sucessAction = { config, payload }
    handleFail(state, sucessAction)
  }

}

export default handleApiError
