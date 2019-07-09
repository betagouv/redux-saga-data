<img alt="redux-saga-data logo" src="https://raw.githubusercontent.com/betagouv/redux-saga-data/master/icon.png" height=60/>

A lib for fetching normalized data in a redux store through sagas.

See the full [documentation](https://redux-saga-data.netlify.com) for further complex use cases with several collections of data.

[![CircleCI](https://circleci.com/gh/betagouv/redux-saga-data/tree/master.svg?style=svg)](https://circleci.com/gh/betagouv/redux-saga-data/tree/master)
[![npm version](https://img.shields.io/npm/v/redux-saga-data.svg?style=flat-square)](https://npmjs.org/package/redux-saga-data)

## Basic Usage

You need to install a redux-saga setup with the watchDataActions and the data reducer:

```javascript
import {
  applyMiddleware,
  combineReducers,
  createStore
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { createDataReducer, watchDataActions } from 'redux-saga-data'

const sagaMiddleware = createSagaMiddleware()
const storeEnhancer = applyMiddleware(sagaMiddleware)

function* rootSaga() {
  yield all([
    watchDataActions({
      rootUrl: 'http://momarx.fr',
    }),
  ])
}

const rootReducer = combineReducers({
  data: createDataReducer({ users: [] }),
})

const store = createStore(rootReducer, storeEnhancer)

sagaMiddleware.run(rootSaga)
```

Then you can request data from your api that will be stored
in the state.data

```javascript
import React, { Fragment } from 'react'
import { requestData } from 'redux-redux-saga'

class Foos extends Component {
  constructor () {
    super()
    this.state = { error: null }
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(requestData({
      apiPath: '/foos',
      handleFail: () => this.setState({ error: action.error }),
      method:'GET'
    }))
  }

  render () {
    const { foos } = this.props
    const { error } = this.state

    if (error) {
      return error
    }

    return (
      <Fragment>
        {foos.map(foo => (
          <div key={foo.id}> {foo.text} </div>
        ))}
      </Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    foos: state.data.foos
  }
}

export default connect(mapStateToProps)(Foo)
```

NOTE: We could also used a handleSuccess in the requestData api, in order to grab the action.data foos in that simple case:

```javascript
constructor () {
  this.state = { error: null, foos: [] }
}

componentDidMount () {
  const { dispatch } = this.props
  dispatch(requestData({
    apiPath: '/foos',
    handleFail: () => this.setState({ error: action.error }),
    handleSuccess: () => this.setState({ foos: action.data }),
    method:'GET'
  }))
}

render () {
  const { error, foos } = this.setState
  ...
}
```

But if your rendered foos array should be coming from a memoizing merging (and potentially normalized) (and potentially selected from inter data filter conditions) state of foos, then syntax goes easier if you pick from the connected redux store lake of data.

## Usage with config

See all the possible config for requestData in the [fetch-normalize-data]( https://github.com/betagouv/fetch-normalize-data/tree/master) doc.
