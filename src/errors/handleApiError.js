import { failData } from 'fetch-normalize-data'
import { call, put, select } from 'redux-saga/effects'

export function *handleApiError(result, config) {
  const { handleFail } = config

  yield put(failData(result, config))

  if (handleFail) {
    const state = yield select(s => s)
    const sucessAction = { config, result }
    yield call(handleFail, state, sucessAction)
  }

}

export default handleApiError
