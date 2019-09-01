import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function *handleApiError(payload, config) {
  const { handleFail } = config

  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const sucessAction = { config, payload }
    yield call(handleFail,state, sucessAction)
  }

}

export default handleApiError
