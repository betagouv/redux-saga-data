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

export const fromWatchRequestDataActions = configWithoutDefaultValues =>
  function* fetchToSuccessOrFailData(action) {
    const config = getConfigWithDefaultValues(
      Object.assign({}, configWithoutDefaultValues, action.config)
    )
    const { timeout } = config

    const url = getUrlFromConfig(config)

    const fetchDataMethod = config.fetchData || fetchData

    try {
      let delayed
      let payload
      if (timeout) {
        const result = yield race({
          delayed: call(delay, timeout),
          payload: call(fetchDataMethod, url, config),
        })
        /* eslint-disable-next-line prefer-destructuring */
        payload = result.payload
        /* eslint-disable-next-line prefer-destructuring */
        delayed = result.delayed
      } else {
        payload = yield call(fetchDataMethod, url, config)
      }
      const { errors, status } = payload

      const isSuccess = isSuccessStatus(status)
      if (isSuccess) {
        yield call(handleApiSuccess, payload, config)
        return
      }

      if (errors) {
        yield call(handleApiError, payload, config)
      }

      if (delayed) {
        yield call(handleTimeoutError, config)
      }
    } catch (error) {
      yield call(handleServerError, error, config)
    }
  }

export default fromWatchRequestDataActions
