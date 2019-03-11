import get from 'lodash.get'
import channels from './channels'

function fetchData (method, path, config) {

  console.log('method, path, config', method, path, config)

  if (path === 'channels' && method === 'GET') {
    return { data: channels }
  }

  if (path.match(/videos\/(.*)$/) && method === 'PATCH') {
    const videoId = get(path.match(/videos\/(.*)$/), '0')
    if (videoId) {
      for (let channel of channels) {
        for (let video of channel.videos) {
          if (video.id === videoId) {
            Object.assign(video, config.body)
            return { data: video }
          }
        }
      }
      return { channels: "No such video id" }
    }
  }

  return { global: "No such path "}
}

export default fetchData
