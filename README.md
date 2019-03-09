# redux-request-data

A lib for fetching normalized data in a redux store through sagas

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
      url: 'http://foo.com',
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

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(requestData('GET', 'foos'))
  }

  render () {
    const { foos } = this.props
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
