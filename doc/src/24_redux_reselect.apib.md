### Redux Reselect

Suppose you want several refined list of channels, ie instead of rendering all the channels:

```javascript
  return (
    <Fragment>
      <SubscribedChannels />
      <MostPopularChannels />
      <MarxLoversChannels />
      {...}
    </Fragment>
  )
```

You may first loose energy at passing the this.state.channels to all the children <SomethingChannels /> elements.

You would need also to think at the good place to implement your filters
on isSubscribed and rank, etc... in order to call them only
when it is needed.

That is when the redux-reselect pattern is used in our framework.
Such <SubscribedChannels /> will be in this workflow written like this:

```javascript
import React from 'react'
import { createSelector } from 'reselect'

const SubscribedChannels = ({ subscribedChannels }) => (
  <div>
    <p> subscriptions: </p>
    {
      subscribedChannels.map(({ id, name }) => (
        <p key={id}>
          {name}
        </p>
      ))
    }
  </div>
)

const selectSubscribedChannels = createSelector(
  state => state.data.channels,
  channels => channels.filter(channel => channel.isSubscribed)
)

export default connect(
  state => ({ subscribedChannels: selectSubscribedChannels(state) })
)(SubscribedChannels)
```

For summary,

requestData will feed the redux store, making your entities usually available at state.data.<collectionName>, like state.data.channels at successData Action time.
(triggered by saga listening to the requestData action when api payloads returns a success)

Also it will feed the redux store from api errors, at state.errors.<collectionName>, like state.errors.channels at failData Action time.
(triggered by saga listening to the requestData action when api payloads returns an error)
