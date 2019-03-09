import {
  getNormalizedDeletedState,
  getNormalizedMergedState
} from 'normalized-data-state'

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

    const stateKey = action.config.stateKey ||
      (action.config.apiPath && getStateKeyFromApiPath(action.config.apiPath)) ||
      (action.config.url && getStateKeyFromUrl(action.config.url))

    const data = !Array.isArray(action.dataOrDatum)
      ? [action.dataOrDatum]
      : action.dataOrDatum

    const patch = { [stateKey]: data }

    const nextState = action.method === 'DELETE'
        ? getNormalizedDeletedState(state, patch, action.config)
        : getNormalizedMergedState(state, patch, action.config)

    if (action.config.getSuccessState) {
      Object.assign(nextState, action.config.getSuccessState(state, action))
    }

    return Object.assign({}, state, nextState)
  }
  return state
}

export default createData
