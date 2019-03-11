# redux-saga-data

A lib for fetching normalized data in a redux store through sagas.

See the full [documentation](https://redux-saga-data.netlify.com) for further complex use cases with several collections of data.

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
import { createData, watchDataActions } from 'redux-saga-data'

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
  data: createData({ users: [] }),
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

### requestData

| name | type | example | isRequired | default | description |
| -- | -- | -- | -- | -- | -- |
| apiPath | `string` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `undefined` | apiPath will be join with rootUrl to build the request url |
| handleFail | `function(state, action)` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `undefined` | callback called if request has failed |
| handleSuccess | `function(state, action)` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `undefined` | callback called if request is a success |
| method | `STRING` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | 'GET' | http method for the request |
| stateKey | `string` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `<computed from apiPath or url>` | key into the `store.getState().data.<stateKey>` where normalized merged or deleted data will be applied |
| url | `string` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `undefined` | total url of the request that will be used if apiPath is not used |


NOTE: All the data inside state.data.<array> are obeying to the [normalized-data-state](https://github.com/betagouv/normalized-data-state) rules, and you can pass here also attributes from `getNormalizedMergedState` config like:

| name | type | example | isRequired | default | description |
| -- | -- | -- | -- | -- | -- |
| normalizer | `object` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `undefined` | normalizer config that will be computed at the `store.getState().data.<stateKey>` in the redux cache |
| isMergingArray | `boolean` | [See test](https://github.com/betagouv/normalized-data-state/blob/887323e6146d5eec40203b4f4b692bfcb65a4cd9/src/tests/getNormalizedMergedState.spec.js#L92) | no | `true` | decide if `nextState.<arrayName>` will be a merge of previous and next data or just a replace with the new array |
