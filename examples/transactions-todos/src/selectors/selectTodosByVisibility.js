import createCachedSelector from 're-reselect'

function mapArgsToKey (state, visibility) {
  return visibility || ''
}

const selectTodosByVisibility = createCachedSelector(
  state => state.data.todos,
  (state, visibility) => visibility,
  (todos, visibility) => {
    switch (visibility) {
      case 'ACTIVE':
        return todos.filter(todo => !todo.completed)
      case 'ALL':
        return todos
      case 'COMPLETED':
        return todos.filter(todo => todo.completed)
      default:
        return
    }
  }
)(mapArgsToKey)

export default selectTodosByVisibility
