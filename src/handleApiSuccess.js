import { successData } from 'fetch-normalize-data'
import { put, select } from 'redux-saga/effects'

export function *handleApiSuccess(payload, config) {
  const { handleSuccess } = config

  yield put(successData(payload, config))

  if (handleSuccess) {
    const state = yield select(s => s)
    handleSuccess(state, { config, payload })
  }

}

export default handleApiSuccess
