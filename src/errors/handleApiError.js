import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function* handleApiError(payload, config) {
  const { handleFail } = config
  payload['error_type'] = 'API_ERROR'
  yield put(failData(payload, config))

  if (handleFail) {
    const state = yield select(s => s)
    const action = { config, payload }
    yield call(handleFail, state, action)
  }
}

export default handleApiError
