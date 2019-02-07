import { delay } from 'redux-saga'
import { call, put, race, select, takeEvery } from 'redux-saga/effects'

import { failData, successData } from './actionCreators'
import { fetchData } from './fetchData'

export const fromWatchRequestDataActions = (extraConfig = {}) =>
  function *watchRequestDataActions(action) {
    // UNPACK
    const { method, path } = action

    // CONFIG
    const config = Object.assign({}, extraConfig, action.config)
    const { body, encode, timeout, url } = config
    const fetch = config.fetchData || fetchData

    // DATA
    try {
      // RACE
      let fetchResult
      let timeoutResult
      if (timeout) {
        const raceResult = yield race({
          fetchResult: call(fetch, method, path, { body, encode, url }),
          timeoutResult: call(delay, timeout),
        })
        fetchResult = raceResult.fetchResult
        timeoutResult = raceResult.timeoutResult
      } else {
        fetchResult = yield call(fetch, method, path, { body, encode, url })
      }

      // RESULT
      if (fetchResult) {
        // PASSING CONFIG
        const { ok, status } = fetchResult
        Object.assign(config, { ok, status })

        // SUCCESS OR FAIL
        if (fetchResult.data) {
          yield put(successData(method, path, fetchResult.data, config))
        } else if (fetchResult.errors) {
          console.error(fetchResult.errors)
          yield put(failData(method, path, fetchResult.errors, config))
        } else {
          console.warn(
            `expected a fetched data or a errors from ${method} ${path}`
          )
        }
      } else if (timeoutResult) {
        // TIMEOUT
        const errors = [
          {
            global: ['La connexion au serveur est trop faible'],
          },
        ]
        console.error(errors)
        yield put(failData(method, path, errors, config))
      }
    } catch (error) {
      // catch is a normally a fail of the api
      Object.assign(config, { ok: false, status: 500 })
      const errors = [
        {
          global: ['Erreur serveur. Tentez de rafraîchir la page.'],
        },
        {
          data: [String(error)],
        },
      ]
      console.error(errors)
      yield put(failData(method, path, errors, config))
    }
  }

export function* fromWatchFailDataActions(action) {
  if (action.config.handleFail) {
    const currentState = yield select(state => state)
    yield call(action.config.handleFail, currentState, action)
  }
}

export function* fromWatchSuccessDataActions(action) {
  if (action.config.handleSuccess) {
    const currentState = yield select(state => state)
    yield call(action.config.handleSuccess, currentState, action)
  }
}

export function* watchDataActions(config = {}) {
  yield takeEvery(
    ({ type }) => /REQUEST_DATA_(.*)/.test(type),
    fromWatchRequestDataActions(config)
  )
  yield takeEvery(
    ({ type }) => /FAIL_DATA_(.*)/.test(type),
    fromWatchFailDataActions
  )
  yield takeEvery(
    ({ type }) => /SUCCESS_DATA_(.*)/.test(type),
    fromWatchSuccessDataActions
  )
}
