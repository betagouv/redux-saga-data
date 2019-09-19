import { successData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function* handleApiSuccess(payload, config) {
  const { handleSuccess } = config

  yield put(successData(payload, config))

  if (handleSuccess) {
    const state = yield select(s => s)
    const successAction = { config, payload }
    yield call(handleSuccess, state, successAction)
  }
}

export default handleApiSuccess
