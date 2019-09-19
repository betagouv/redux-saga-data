import { takeEvery } from 'redux-saga/effects'

import fromWatchRequestDataActions from './fromWatchRequestDataActions'

export function* watchDataActions(config = {}) {
  yield takeEvery(
    ({ type }) => /REQUEST_DATA_(.*)/.test(type),
    fromWatchRequestDataActions(config)
  )
}

export default watchDataActions
