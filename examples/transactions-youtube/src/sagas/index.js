import { watchDataActions } from 'pass-culture-shared'
import { all } from 'redux-saga/effects'

import fetchData from '../server/fetchData'

function* rootSaga() {
  yield all([
    watchDataActions({
      // special local fake server for the demo
      fetchData,
    })
  ])
}

export default rootSaga
