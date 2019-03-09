import {
  ASSIGN_DATA,
  MERGE_DATA,
  RESET_DATA
} from './actions'

export const assignData = patch => ({
  patch,
  type: ASSIGN_DATA,
})

export const mergeData = (patch, config) => ({
  config,
  patch,
  type: MERGE_DATA
})

export const failData = (method, path, errors, config) => ({
  config,
  errors,
  method,
  path,
  type: `FAIL_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})

export const requestData = (method, path, config = {}) => ({
  config,
  method,
  path,
  type: `REQUEST_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})

export const resetData = () => ({
  type: RESET_DATA,
})

export const successData = (method, path, dataOrDatum, config = {}) => ({
  config,
  dataOrDatum,
  method,
  path,
  type: `SUCCESS_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})
