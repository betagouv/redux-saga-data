### Mutation

Suppose first we can click on it to mutate isFavorite

```javascript
{
  lastSubscribedVideos.map({ id, isFavorite, name }) => (
    <p key={id}>
      {name} {' '} {isFavorite && '*'}
    </p>
  ))
}
```
by

```javascript
{
  lastSubscribedVideos.map(video => (
    <VideoItem
      key={video.id}
      video={video}
    />
  ))
}
```

with

```javascript
import { requestData } from 'pass-culture-shared'
import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'

class VideoItem extends Component {

  onFavoriteClick = () => {
    const { dispatch, video } = this.props
    const { id, isFavorite } = video

    dispatch(requestData(
      'PATCH',
      `videos/${id}`,
      {
        body: {
          isFavorite: !isFavorite
        }
      }
    ))
  }

  render () {
    const { video } = this.props
    const { isFavorite, name } = video

    return (
      <div>
        {name}
        {' '}
        <button onClick={this.onFavoriteClick}>
          {isFavorite && '*'}
        </button>
      </div>
    )
  }
}

export default connect()(VideoItem)
```

In this approach, onFavoriteClick the VideoItem will refresh the * accordingly to the sync state with the backend db.
