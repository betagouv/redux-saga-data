### Dealing with nested payloads

From the backend channels payload comes with attached videos.
Without doing anything, action.data and state.data.channels will be like a nested array of

```
[
  {
      id: "AXYU",
      name: "Bellevilloise mon amour",
      videos: [
        {
          channelId: "AXYU",
          id: "CER1",
          isFavorite: true,
          name: "PNL chante Marx",
          publishedDatetime: '2018-09-21 20:00:00'
        },
        {
          channelId: "AXYU",
          id: "UIZOS",
          isFavorite: false,
          name: "Franck Lepage rencontre Squeezie",
          publishedDatetime: '2018-09-22 21:00:00'
        },
        ...
      ]
  },
  {
      id: "ERUIO",
      name: "La buvette de la Rochecorbon",
      videos: [
        {
          channelId: "ERUIO",
          id: "MPSIE",
          isFavorite: false,
          name: "Grolinette mon amour",
          publishedDatetime: '2018-09-23 21:00:00',
        },
        ...
      ]
  },
  ...
]
```

For each video, we can say if it is a favorite one, and it would be cool
if each channel item could reflect their specific aggregated number of favorites.

Handling a 'naive' sync between the channels and the nested videos could be done like this:

```javascript
import flatten from 'lodash.flatten'
import React from 'react'
import { createSelector } from 'reselect'

const SubscribedChannels = ({ lastSubscribedVideos, subscribedChannels }) => (
  <div>
    <p> Subscriptions: </p>
    {
      subscribedChannels.map(({ id, favoritesCount, name}) => (
        <p key={id}>
          {name}
          {' '}
          {favoritesCount} favorites videos
        </p>
      ))
    }
    <p> Last Videos! </p>
    {
      lastSubscribedVideos.map({ id, isFavorite, name }) => (
        <p key={id}>
          {name} {' '} {isFavorite && '*'}
        </p>
      ))
    }
  </div>
)

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => {
    let subscribedChannels = channels.filter(channel => channel.isSubscribed)

    subscribedChannels = subscribedChannels.map(channel =>
      // Note that we pay attention to not mutate the
      // object value stored in the reducer
      Object.assign(
        {
          favoritesCount: channel.videos.filter(video => video.isFavorite).length
        },
        channel
      )
    )

    return subscribedChannels

  }
)

const selectLastSubscribedVideos = createSelector(
  selectSubscribedChannels,
  subscribedChannels => flatten(
    subscribedChannels.map(cChannel =>
      channel.videos.filter(video =>
        (moment(video.publishedDatetime) - moment.now()).getDays() < 3)
      )
    )
)

export default connect(
  state => ({
    lastSubscribedVideos: selectLastSubscribedVideos(state),
    subscribedChannels: selectSubscribedChannels(state)
  })
)
```

Ok, game is done, if we don't want mutating action on our db.
