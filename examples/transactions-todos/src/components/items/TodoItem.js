import classnames from 'classnames'
import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

class TodoItem extends Component {

  constructor () {
    super()
    this.state = {
      editing: false,
      editText: ""
    }
  }

  onChange = event => {
    if (this.props.editing) {
      this.setState({ editText: event.target.value })
    }
  }

  onCompletedClick = () => {
    const { dispatch, todo } = this.props
    const { completed, id } = todo

    dispatch(requestData(
      'PATCH',
      `todos/${id}`,
      {
        body: {
          completed: !completed
        }
      }
    ))
  }

  onDestroyClick = () => {
    const { dispatch, todo } = this.props
    const { id } = todo

    dispatch(requestData('DELETE', `todos/${id}`))
  }

  onEditDoubleClick = () => {
    this.setState({ editing: true })
  }

  onKeyDown = event => {
    const { todo } = this.props
    const { text } = todo

    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: text })
      this.onCancel(event)
    } else if (event.which === ENTER_KEY) {
      this.onSubmit(event)
    }
  }

  onSubmit = event => {
    const { dispatch, todo } = this.props
    const { id } = todo
    const text = event.target.value

    dispatch(requestData(
      'PATCH',
      `todos/${id}`,
      { body: { text } }
    ))
  }

  render () {
    const { todo } = this.props
    const { completed, text } = todo
    const { editing, editText } = this.state
    return (
      <li
        className={classnames({
          completed: completed,
          editing: editing
        })}
        style={{
          textDecoration: completed ? 'line-through' : 'none'
        }}
      >
        <div className='view'>
          <input
            className='toggle'
            type='checkbox'
            checked={completed}
            onChange={this.onCompletedClick}
          />
          <label onDoubleClick={this.onEditDoubleClick}>
            {text}
          </label>
          <button className='destroy' onClick={this.onDestroyClick} />
        </div>
        <input
    			ref='editField'
    			className='edit'
    			value={editText}
    			onBlur={this.onSubmit}
    			onChange={this.onChange}
    			onKeyDown={this.onKeyDown}
    		/>
      </li>
    )
  }
}

export default connect()(TodoItem)
