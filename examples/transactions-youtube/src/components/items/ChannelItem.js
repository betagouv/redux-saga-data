import React from 'react'
import { connect } from 'react-redux'

import selectFavoritesCountByChannelId from '../../selectors/selectFavoritesCountByChannelId'

const ChannelItem = ({ favoritesCount, name }) => (
  <p>
    {name}
    {' '}
    {favoritesCount} favorites videos
  </p>
)

export default connect(
  (state, ownProps) => ({
    favoritesCount: selectFavoritesCountByChannelId(state, ownProps.channel.id)
  })
)(ChannelItem)
