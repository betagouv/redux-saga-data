import {
  ASSIGN_DATA,
  MERGE_DATA,
  RESET_DATA
} from './actions'
import {
  getConfigWithDefaultValues,
  getTypeSuffixFromConfig
} from './utils'


export const assignData = patch => ({
  patch,
  type: ASSIGN_DATA,
})

export const mergeData = (patch, config = {}) => ({
  config,
  patch,
  type: MERGE_DATA
})

export const failData = (config = {}) => ({
  config,
  type: `FAIL_DATA_${getTypeSuffixFromConfig(config)}`
})

export const requestData = (config = {}) => {
  const configWithDefaultValues = getConfigWithDefaultValues(config)
  return {
    config: configWithDefaultValues,
    type: `REQUEST_DATA_${getTypeSuffixFromConfig(configWithDefaultValues)}`
  }
}

export const resetData = () => ({
  type: RESET_DATA,
})

export const successData = (config = {}) => ({
  config,
  type: `SUCCESS_DATA_${getTypeSuffixFromConfig(config)}`
})
