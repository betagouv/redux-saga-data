import { createSelector } from 'reselect'

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => channels.filter(channel => channel.isSubscribed)
)

export default selectSubscribedChannels
