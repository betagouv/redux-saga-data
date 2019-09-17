import {
  fetchData,
  getConfigWithDefaultValues,
  getUrlFromConfig,
  isSuccessStatus,
} from 'fetch-normalize-data'
import { delay } from 'redux-saga'
import { call, race } from 'redux-saga/effects'

import handleApiSuccess from './handleApiSuccess'
import handleApiError from './errors/handleApiError'
import handleTimeoutError from './errors/handleTimeoutError'
import handleServerError from './errors/handleServerError'

export const fromWatchRequestDataActions = (configWithoutDefaultValues) =>
  function *fetchToSuccessOrFailData(action) {
    const config = getConfigWithDefaultValues(
      Object.assign({}, configWithoutDefaultValues, action.config)
    )
    const { timeout } = config

    const url = getUrlFromConfig(config)

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
      const { payload, status } = fetchResult

      const isSuccess = isSuccessStatus(status)
      if (isSuccess) {
        yield call(handleApiSuccess, fetchResult, config)
        return
      }

      if (payload.errors) {
        yield call(handleApiError, fetchResult, config)
      }

      if (timeoutResult) {
        yield call(handleTimeoutError, config)
      }

    } catch (error) {
      yield call(handleServerError, error, config)
    }
  }

export default fromWatchRequestDataActions
