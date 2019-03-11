import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import ChannelItem from '../../items/ChannelItem'
import selectSubscribedChannels from '../../../selectors/selectSubscribedChannels'

const SubscribedChannels = ({ subscribedChannels }) => (
  <Fragment>
    <h1> My Subscriptions </h1>
    {subscribedChannels.map(subscribedChannel => (
    <ChannelItem key={subscribedChannel.id} channel={subscribedChannel} />))}
  </Fragment>
)

export default connect(
  state => ({ subscribedChannels: selectSubscribedChannels(state) })
)(SubscribedChannels)
