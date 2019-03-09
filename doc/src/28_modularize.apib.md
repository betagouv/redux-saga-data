### Modularize

If you don't feel easy with filter logic in reselects, you may
instead keep on modularizing your components and you will find by yourself
that selectors are more easy to write, for example in this case where in the ChannelsPage, let's modularize also things into ChannelItems:

replace
```javascript
{
  subscribedChannels.map(({ id, favoritesCount, name}) => (
    <p key={id}>
      {name}
      {' '}
      {favoritesCount} favorites videos
    </p>
  ))
}
```
by

```javascript
{
  subscribedChannels.map(subscribedChannel => (
    <ChannelItem key={subscribedChannel.id} channel={subscribedChannel />
  )
}
```

Then ChannelItem does more easily the job for being sync with the videos isFavorite mutations.

```javascript
import React from 'react'
import { connect } from 'react-redux'
import { createCachedSelector } from 're-reselect'

const ChannelItem = ({ favoritesCount, name }) => (
  <p>
    {name}
    {' '}
    {favoritesCount} favorites videos
  </p>
)

const selectFavoritesCountByChannelId => createCachedSelector(
  state => state.data.videos,
  (state, channelId) => channelId
  (videos, channelId) => videos.filter(video =>
                                  video.channelId === channelId &&
                                  video.isFavorite
                                ).length
)((state, channelId) => channelId || '')

export default connect(
  (state, ownProps) => ({
    favoritesCount: selectFavoritesCountByChannelId(state, ownProps.channel.id)
  })
)(ChannelItem)

```
