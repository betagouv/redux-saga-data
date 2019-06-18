import { successData } from 'fetch-normalize-data'
import { put, select } from 'redux-saga/effects'

export function *handleApiSuccess(payload, config) {
  const { handleSuccess } = config

  if (handleSuccess) {
    const state = yield select(s => s)
    const sucessAction = { config, payload }
    handleSuccess(state, sucessAction)
  }

  yield put(successData(payload, config))

}

export default handleApiSuccess
