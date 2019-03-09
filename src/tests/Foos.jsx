import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { requestData } from '../index'

export class Foos extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(requestData('GET', 'foos'))
  }

  render () {
    const { foos } = this.props
    return (
      <Fragment>
        {foos.map(foo => (
          <div key={foo.id}> {foo.text} </div>
        ))}
      </Fragment>
    )
  }
}

Foos.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    foos: state.data.foos
  }
}

export default connect(mapStateToProps)(Foos)
