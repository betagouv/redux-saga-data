import {
  getNormalizedDeletedState,
  getNormalizedMergedState
} from 'normalized-data-state'

import { successStatusCodesWithDataOrDatum } from './status'

import { ASSIGN_DATA, MERGE_DATA, RESET_DATA } from './actions'
import { getStateKeyFromApiPath, getStateKeyFromUrl } from './utils'

export const createData = (initialState = {}) => (
  state = initialState,
  action
) => {

  if (action.type === ASSIGN_DATA) {
    return Object.assign({}, state, action.patch)
  }

  if (action.type ===  MERGE_DATA) {
    const nextState = getNormalizedMergedState(state, action.patch, action.config)
    return Object.assign({}, state, nextState)
  }

  if (action.type === RESET_DATA) {
    return initialState
  }

  if (/SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type)) {
    const config = Object.assign({}, action.config)
    const { apiPath, datum, method, normalizer, status, url } = config

    const stateKey = config.stateKey ||
      (apiPath && getStateKeyFromApiPath(apiPath)) ||
      (url && getStateKeyFromUrl(url))

    if (!successStatusCodesWithDataOrDatum.includes(status)) {
      return Object.assign({}, state)
    }

    let { data } = config
    if (!data) {
      if (!datum) {
        data = [datum]
      } else {
        data = []
      }
    }

    const patch = { [stateKey]: data }

    if (normalizer) {
      config.normalizer = {
        [stateKey]: {
          normalizer,
          stateKey
        }
      }
    }

    const nextState = method === 'DELETE'
        ? getNormalizedDeletedState(state, patch, config)
        : getNormalizedMergedState(state, patch, config)

    if (config.getSuccessState) {
      Object.assign(nextState, config.getSuccessState(state, action))
    }

    return Object.assign({}, state, nextState)
  }
  return state
}

export default createData
