import { ASSIGN_DATA, MERGE_DATA, RESET_DATA } from './actions'
import { getNextState } from './getNextState'

export const createData = (initialState = {}) => (
  state = initialState,
  action
) => {
  if (action.type === ASSIGN_DATA) {
    return Object.assign({}, state, action.patch)
  }
  if (action.type ===  MERGE_DATA) {
    const nextState = getNextState(state, 'GET', action.patch, action.config)
    return Object.assign({}, state, nextState)
  }
  if (action.type === RESET_DATA) {
    return initialState
  }
  if (/SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type)) {
    // unpack config
    const key =
      action.config.key ||
      action.path
        .replace(/\/$/, '')
        .split('?')[0]
        .split('/')[0]

    // resolve
    const nextState = getNextState(
      state,
      action.method,
      {
        // force casting into an array
        [key]: !Array.isArray(action.data) ? [action.data] : action.data,
      },
      Object.assign({ path: action.path }, action.config)
    )

    // last
    if (action.config.getSuccessState) {
      Object.assign(nextState, action.config.getSuccessState(state, action))
    }

    // return
    return Object.assign({}, state, nextState)
  }
  return state
}

export default createData
