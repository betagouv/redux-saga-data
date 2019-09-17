import { successData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function *handleApiSuccess(result, config) {
  const { handleSuccess } = config

  yield put(successData(result, config))

  if (handleSuccess) {
    const state = yield select(s => s)
    const sucessAction = { config, result }
    yield call(handleSuccess, state, sucessAction)
  }
}

export default handleApiSuccess
