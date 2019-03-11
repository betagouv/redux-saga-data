import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setFilter } from '../../../reducers/filter'

class FilterButton extends Component {

  onClick = () => {
    const { dispatch, visibility } = this.props
    dispatch(setFilter(visibility))
  }

  render () {
    return (
      <button onClick={this.onClick}>
        {this.props.children}
      </button>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

export default connect(mapStateToProps)(FilterButton)
