import { requestData } from 'pass-culture-shared'
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
