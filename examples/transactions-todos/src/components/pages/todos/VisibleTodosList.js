import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import TodoItem from '../../items/TodoItem'

class VisibleTodosList extends Component {

  onToggleAllTodosClick = () => {
    // TODO
  }

  render () {
    const {
      todos
    } = this.props
    const activeTodoCount = todos.reduce((accum, todo) => {
      return todo.completed ? accum : accum + 1
    }, 0)

    
    return (
      <section className='main'>
        <input
          className='toggle-all'
          type='checkbox'
          onChange={this.onToggleAllTodosClick}
          checked={activeTodoCount === 0}
        />
        <ul className='todo-list'>
          {todos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
            />
          )}
        </ul>
      </section>
    )
  }
}

VisibleTodosList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
}

function mapStateTopProps (state) {
  return {
    todos: state.data.todos
  }
}

export default connect(mapStateTopProps)(VisibleTodosList)
