### Normalizer

One rude way would consist in writing in the handleSucces of the 'videos/${id}'
something helping to make keeping the ChannelsPage aware of that change.

We can also use the normalizing method for doing it in a sugar manner.
We first need to tell how we want stored the data in the data reducer.

```javascript
class ChannelsPage extends Component {

  ...

  componentDidMount() {
      this.props.dispatch(requestData('GET', 'channels', {
        ...
        normalizer: {
          // normalizer is a recursive mapping process
          // KEY in each entities // KEY in the state.data
          videos:                    'videos'
        }
      }))
  }
  ...
}
```

What does this normalizer stand for ? It means here that all the channels entities
will be parsed to find if they have a KEY 'videos', and all of these elements
will be concatenated (and unified by their id) in an other state.data.videos array.

IMPORTANT NOTE:
In addition of data stored at state.data.videos,
the state.data.venues will not have anymore their nested children { videos },
as it is now a redundant and not reactive sub data info.

We need now some adaptation in the mapStateToProps of the SubscribedChannels Component:

```javascript

const selectLastSubscribedVideosByChannelId = createCachedSelector(
  state => state.data.videos,
  (state, channelId) => channelId,
  videos => (
  videos.filter(video =>
    (moment(video.publishedDatetime) - moment.now()).getDays() < 3) &&
    video.channelId === channelId
  )
)((state, channelId) => channelId || '')

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => {
    let subscribedChannels = channels.filter(channel => channel.isSubscribed)

    subscribedChannels = subscribedChannels.map(channel =>

      const lastSubscribedVideos = selectLastSubscribedVideosByChannelId(
        state, channel.id)

      Object.assign(
        {
          favoritesCount: lastSubscribedVideos.filter(video => video.isFavorite)
                                              .length
        },
        channel
      )
    )

    return subscribedChannels
  }
)

const selectLastSubscribedVideosByChannels = createSelector(
  state => state.data.videos,
  (state, channels) => channels,
  (videos, channels) => flatten(
    channels.map(channel =>
      videos.filter(video =>
        // do the retrieve tx to the joining key
        channels.find(channel =>
          video.channelId  === channel.id)
        &&
        (moment(video.publishedDatetime) - moment.now()).getDays() < 3
      )
    )
  )
)

export default connect(
  state => {
    const subscribedChannels = selectSubscribedChannels(state)
    return {
      lastSubscribedVideos: selectLastSubscribedVideosByChannels(state, subscribedChannels),
      subscribedChannels
    }
  }
)
```
