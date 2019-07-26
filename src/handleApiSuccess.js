import { successData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function *handleApiSuccess(payload, config) {
  const { handleSuccess } = config

  yield put(successData(payload, config))

  if (handleSuccess) {
    const state = yield select(s => s)
    const sucessAction = { config, payload }
    yield call(handleSuccess, state, sucessAction)
  }
}

export default handleApiSuccess
