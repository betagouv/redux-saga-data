export function getConfigWithDefaultValues(config) {
  return Object.assign({
    method: 'GET'
  }, config)
}

export function getStateKeyFromApiPath(apiPath) {
  return apiPath
      .replace(/^\/|\/$/g, '')
      .split('?')[0]
      .split('/')[0]
}

export function getStateKeyFromUrl(url) {
  const apiPath = url.split('/').slice(3).join('/')
  return getStateKeyFromApiPath(apiPath)
}

export function getTypeSuffixFromConfig(config) {
  const { apiPath, method, stateKey, tag, url } = getConfigWithDefaultValues(config)
  return `${method}_${stateKey || apiPath || url}${tag ? `_${tag}` : ''}`.toUpperCase()
}
