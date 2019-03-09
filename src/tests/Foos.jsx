import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { requestData } from '../index'

export class RawFoos extends Component {
  componentDidMount () {
    const { dispatch, onFailUpdateCallback } = this.props
    dispatch(requestData('GET', 'foos', {
      handleFail: () => onFailUpdateCallback()
    }))
  }

  componentDidUpdate (prevProps) {
    const {
      foos,
      onSuccessUpdateCallback
    } = this.props

    // it is part of the test that foos lenght should be equal to 2
    if (foos !== prevProps.foos && foos.length === 2) {
      onSuccessUpdateCallback()
    }
  }

  render () {
    const { foos } = this.props
    return (
      <Fragment>
        {foos.map(foo => (
          <div className="foo" key={foo.id}>
            {foo.text}
          </div>
        ))}
      </Fragment>
    )
  }
}

RawFoos.defaultProps = {
  foos: [],
  onFailUpdateCallback: () => {},
  onSuccessUpdateCallback: () => {}
}

RawFoos.propTypes = {
  dispatch: PropTypes.func.isRequired,
  foos: PropTypes.arrayOf(PropTypes.object),
  onFailUpdateCallback: PropTypes.func,
  onSuccessUpdateCallback: PropTypes.func
}

function mapStateToProps(state) {
  return {
    foos: state.data.foos
  }
}

const Foos = connect(mapStateToProps)(RawFoos)

export default Foos
