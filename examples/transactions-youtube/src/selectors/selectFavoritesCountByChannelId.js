import createCachedSelector from 're-reselect'

const selectFavoritesCountByChannelId = createCachedSelector(
  state => state.data.videos,
  (state, channelId) => channelId,
  (videos, channelId) => videos.filter(video =>
                                  video.channelId === channelId &&
                                  video.isFavorite
                                ).length
)((state, channelId) => channelId || '')

export default selectFavoritesCountByChannelId
