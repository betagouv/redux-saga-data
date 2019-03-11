import pluralize from 'pluralize'
import React from 'react'
import { connect } from 'react-redux'

import FilterButton from './FilterButton'
import selectTodosByVisibility from '../../../selectors/selectTodosByVisibility'

const Footer = ({ todos }) => {
  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1
  }, 0)
  const completedCount = todos.length - activeTodoCount
  const activeTodoWord = pluralize('item', activeTodoCount)
  if (!activeTodoCount && !completedCount) { return <div /> }

  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{activeTodoCount}</strong> {activeTodoWord} left
      </span>
      <ul className='filters'>
  			<li>
          <FilterButton visibility='ALL'>
            All
          </FilterButton>
        </li>
        {' '}
        <li>
          <FilterButton visibility='ACTIVE'>
            Active
          </FilterButton>
        </li>
        {' '}
        <li>
          <FilterButton visibility='COMPLETED'>
            Completed
          </FilterButton>
        </li>
      </ul>
    </footer>
  )
}

const mapStateToProps = (state) => {
  return {
    todos: selectTodosByVisibility(state, 'ALL')
  }
}

export default connect(mapStateToProps)(Footer)
