### Install

In your rootReducer in reducers/index.js:

```javascript
import { createData } from 'pass-culture-shared'
import { combineReducers } from 'redux'

const data = createData({
  // all your initial entities state in array shapes
  channels: [],
  ...
})

const rootReducer = combineReducers({
  data,
  ...
})

export default rootReducer
```

And in your rootSaga in sagas/index.js:

```javascript
import { watchDataActions } from 'pass-culture-shared'
import { all } from 'redux-saga/effects'

// API_URL typically like https://backend.myapp.org
// and usually your entities endpoint will have the shape
// of GET https://backend.myapp.org/channels
import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions\({ url: API\_URL }\),
    ...
  ])
}

export default rootSaga
```
