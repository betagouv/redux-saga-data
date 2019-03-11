import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import todosNormalizer from '../../../normalizers/todosNormalizer'

const ENTER_KEY = 13

class AddTodo extends Component {

  onAddClick = event  => {
    const { dispatch } = this.props

    if (event.keyCode !== ENTER_KEY) { return }
    event.preventDefault()
    if (!this.$input.value.trim()) { return }

    dispatch(requestData('POST', 'todos', {
      body: { text: this.$input.value },
      normalizer: todosNormalizer
    }))

    this.$input.value = ''
  }

  render () {
    return (
      <header className='header'>
        <h1> todos </h1>
        <input
          className='new-todo'
          placeholder='What needs to be done?'
          onKeyDown={this.onAddClick}
          ref={element => { this.$input = element }}
        />
      </header>
    )
  }
}

export default connect()(AddTodo)
