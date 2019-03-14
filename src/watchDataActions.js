import { delay } from 'redux-saga'
import { call, put, race, select, takeEvery } from 'redux-saga/effects'

import { failData, successData } from './actionCreators'
import { fetchData } from './fetchData'
import { isSuccessStatus } from './status'

export const fromWatchRequestDataActions = (extraConfig = {}) =>
  function *watchRequestDataActions(action) {
    let { url } = action
    const config = Object.assign({}, extraConfig, action.config)
    const { apiPath, method, timeout } = config
    if (!url) {
      url = `${config.rootUrl}/${apiPath.replace(/^\//, '')}`
    }
    const fetchDataMethod = config.fetchData || fetchData

    try {
      let fetchResult
      let timeoutResult
      if (timeout) {
        const raceResult = yield race({
          fetchResult: call(fetchDataMethod, url, config),
          timeoutResult: call(delay, timeout),
        })
        /* eslint-disable-next-line prefer-destructuring */
        fetchResult = raceResult.fetchResult
        /* eslint-disable-next-line prefer-destructuring */
        timeoutResult = raceResult.timeoutResult
      } else {
        fetchResult = yield call(fetchDataMethod, url, config)
      }

      if (fetchResult) {
        const { ok, payload, status } = fetchResult
        Object.assign(config, { ok, status })

        const isSuccess = isSuccessStatus(status)

        if (isSuccess) {
          yield put(successData(payload, config))
        } else if (fetchResult.errors) {
          /* eslint-disable-next-line no-console */
          console.error(fetchResult.errors)
          yield put(failData(payload, config))
        } else {
          /* eslint-disable-next-line no-console */
          console.warn(
            `expected a fetched data or a errors from ${method} ${apiPath}`
          )
        }
      } else if (timeoutResult) {
        const errors = [
          {
            global: ['La connexion au serveur est trop faible'],
          },
        ]
        /* eslint-disable-next-line no-console */
        console.error(errors)
        yield put(failData({ errors }, config))
      }
    } catch (error) {
      Object.assign(config, { ok: false, status: 500 })
      const errors = [
        {
          global: ['Erreur serveur. Tentez de rafraîchir la page.'],
        },
        {
          data: [String(error)],
        },
      ]
      /* eslint-disable-next-line no-console */
      console.error(errors)
      yield put(failData({ errors }, config))
    }
  }

export function* fromWatchFailDataActions(action) {
  const { config: { handleFail } } = action
  if (handleFail) {
    const currentState = yield select(state => state)
    yield call(handleFail, currentState, action)
  }
}

export function* fromWatchSuccessDataActions(action) {
  const { config: { handleSuccess } } = action
  if (handleSuccess) {
    const currentState = yield select(state => state)
    yield call(handleSuccess, currentState, action)
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
