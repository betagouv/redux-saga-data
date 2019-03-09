### Hello

requestData is an action creator helping for requesting data from the backend.

It gives "promises like" functions in order to handle things at success or error times of the api return.

Imagine a simple component used for fetching infos on youtube channel entities:

```javascript
import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

class ChannelsPage extends Component {

  constructor () {
    super()
    this.state = {
      globalError: null,
      channels: [],
      channelsError: null
    }
  }

  componentDidMount() {
      // you need to pass
      // method: 'GET', 'POST', 'PATCH', 'PUT' or 'DELETE'
      // path: the route api path to request data (with or without the first trailing slash)
      // config (optional): some config parameters explained later
      this.props.dispatch(requestData('GET', 'channels', {
        // handleSuccess is the "promised" callback function you can use
        // to do things on the success of the request
        // state: the global redux state (if you need it)
        // action: the action associated to SUCCESS_DATA_VENUES giving the data
        handleSuccess: (state, action) => this.setState({ channels: action.data })
        // ... or you can do things on fail
        // you can notably grab backend errors info
        // in action.errors.<key>[array of error string lines]
        handleFail: (state, action) => this.setState({
          // when action returns an error stored in the
          // 'global' key, it means a 500 error
          // except if the backend specially set this
          // error key for saying something else
          globalError: get(action, 'errors.global.0'),
          // when action returns an error with the same key as the pass
          // it means most of the time that the api handled a 400 like error
          channelsError: get(action, 'errors.channels.0')
        })
      }))
  }

  render () {
    const { channels, channelsError, globalError } = this.state

    if (channelsError) {
      return (
        <div className="is-warning">
          {/* something like 'You are not authorized to fetch channels' */}
          {channelsError}
        </div>
      )
    }

    if (globalError) {
      return (
        <div className="is-danger">
        {/* something like 'Connection to the server has failed' */}
          {globalError}
        </div>
      )
    }

    return (
      <div>
        {channels.map(({ id, name }) => <p key={id}> {name} </p>)}
      </div>
    )
  }
}

// NOTE: it is important to connect to pass
// the dispatch function to the props
export default connect()(ChannelsPage)
```
