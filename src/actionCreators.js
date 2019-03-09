import {
  ASSIGN_DATA,
  MERGE_DATA,
  RESET_DATA
} from './actions'
import { getTypeSuffixFromConfig } from './utils'


export const assignData = patch => ({
  patch,
  type: ASSIGN_DATA,
})

export const mergeData = (patch, config) => ({
  config,
  patch,
  type: MERGE_DATA
})

export const failData = (errors, config) => ({
  config,
  errors,
  type: `FAIL_DATA_${getTypeSuffixFromConfig(config)}`
})

export const requestData = (config = {}) => ({
  config,
  type: `REQUEST_DATA_${getTypeSuffixFromConfig(config)}`
})

export const resetData = () => ({
  type: RESET_DATA,
})

export const successData = (dataOrDatum, config = {}) => ({
  config,
  dataOrDatum,
  type: `SUCCESS_DATA_${getTypeSuffixFromConfig(config)}`
})
