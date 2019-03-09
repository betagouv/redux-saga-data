import {
  applyMiddleware,
  combineReducers,
  createStore
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import { createData, watchDataActions } from '../index'

export function configureTestStore() {

  const sagaMiddleware = createSagaMiddleware()
  const storeEnhancer = applyMiddleware(sagaMiddleware)

  function* rootSaga() {
    yield all([
      watchDataActions({
        rootUrl: 'http://momarx.fr',
      }),
    ])
  }

  const rootReducer = combineReducers({
    data: createData({ foos: [] }),
  })

  const store = createStore(rootReducer, storeEnhancer)

  sagaMiddleware.run(rootSaga)

  return store
}

export function configureFetchDataWithRequestFail () {
  fetch.mockResponse(JSON.stringify(
    { global: 'Wrong request for foos' }
  ), { status: 400 })
}

export function configureFetchDataWithRequestSuccess () {
  fetch.mockResponse(JSON.stringify(
    [
      { text: "My foo is here" },
      { test: "My other foo also" }
    ],
  ), { status: 200 })
}

export default configureTestStore
