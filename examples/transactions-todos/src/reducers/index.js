import { errors } from 'pass-culture-shared'
import { combineReducers } from 'redux'

import filter from './filter'

const rootReducer = combineReducers({
  errors,
  filter
})

export default rootReducer
