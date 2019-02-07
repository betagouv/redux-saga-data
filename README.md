# redux-request-data

** EN CONSTRUCTION **
Ce code est du code externalisé du https://github.com/betagouv/pass-culture-shared qui concentre un nombre d'utilités React Redux
utilisé par les applications front du pass culture.
Tant que les tests fonctionnels ne sont pas écrits, cette lib ne peut être considérée en production.

## Basic Usage

You need to install a redux-saga setup with the watchDataActions and the data reducer:

```javascript
import {
  applyMiddleware,
  combineReducers,
  createStore
} from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createData, watchDataActions } from 'redux-saga-data'

const sagaMiddleware = createSagaMiddleware()
const storeEnhancer = applyMiddleware(sagaMiddleware)

function* rootSaga() {
  yield all([
    watchDataActions({
      url: <your api url like "https://myfoo.com">,
    }),
  ])
}

sagaMiddleware.run(rootSaga)

const rootReducer = combineReducers({
  data: createData({ foos: [] }),
})

const store = createStore(rootReducer, storeEnhancer)
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
