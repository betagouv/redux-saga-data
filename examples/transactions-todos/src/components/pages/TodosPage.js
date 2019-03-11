import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import AddTodo from './todos/AddTodo'
import VisibleTodosList from './todos/VisibleTodosList'
import Footer from './todos/Footer'
import todosNormalizer from '../../normalizers/todosNormalizer'

class TodosPage extends Component {

  componentDidMount() {
    this.props.dispatch(requestData('GET', 'todos', {
      normalizer: todosNormalizer
    }))
  }

  render () {
    return (
      <section className="todoapp">
        <AddTodo />
        <VisibleTodosList />
        <Footer />
      </section>
    )
  }
}

export default connect()(TodosPage)
