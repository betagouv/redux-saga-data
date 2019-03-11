import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import SubscribedChannels from './channels/SubscribedChannels'
import channelsNormalizer from '../../normalizers/channelsNormalizer'

class ChannelsPage extends Component {

  componentDidMount() {
    this.props.dispatch(requestData('GET', 'channels', {
      normalizer: channelsNormalizer
    }))
  }

  render () {
    const { channelsError, globalError } = this.props

    if (channelsError) {
      return (
        <div className="is-warning">
          {/* something like 'You are not authorized to fetch channels' */}
          {channelsError}
        </div>
      )
    }

    if (globalError) {
      return (
        <div className="is-danger">
        {/* something like 'Connection to the server has failed' */}
          {globalError}
        </div>
      )
    }

    return (
      <div>
        <SubscribedChannels />
      </div>
    )
  }
}

export default connect(
  state => ({
    channelsError: state.errors.channels,
    globalError: state.errors.global
  })
)(ChannelsPage)
