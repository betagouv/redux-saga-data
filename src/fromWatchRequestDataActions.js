import {
  fetchData,
  getConfigWithDefaultValues,
  getUrlFromConfig,
  isSuccessStatus,
} from 'fetch-normalize-data'
import { delay } from 'redux-saga'
import { call, race } from 'redux-saga/effects'

import handleApiError from './handleApiError'
import handleApiSuccess from './handleApiSuccess'
import handleTimeoutError from './handleTimeoutError'
import handleResultError from './handleResultError'
import handleServerError from './handleServerError'

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

      if (!fetchResult) {
        yield call(handleResultError, config)
      }

      const { ok, payload, status } = fetchResult
      Object.assign(config, { ok, status })

      const isSuccess = isSuccessStatus(status)
      if (isSuccess) {
        yield call(handleApiSuccess, payload, config)
        return
      }

      if (payload.errors) {
        yield call(handleApiError, payload, config)
      }

      if (timeoutResult) {
        yield call(handleTimeoutError, config)
      }

    } catch (error) {
      yield call(handleServerError, error, config)
    }
  }

export default fromWatchRequestDataActions
