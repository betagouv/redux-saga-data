import { errors } from 'pass-culture-shared'
import { combineReducers } from 'redux'

import data from './data'

const rootReducer = combineReducers({
  data,
  errors,
})

export default rootReducer
