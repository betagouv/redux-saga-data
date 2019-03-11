const filter = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.visibility
    default:
      return state
  }
}

export const setFilter = visibility => {
  return {
    type: 'SET_FILTER',
    visibility
  }
}

export default filter
