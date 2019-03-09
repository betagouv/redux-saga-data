import 'babel-polyfill'

import { mount, shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import { configureTestStore,
  configureFetchDataWithRequestFail,
  configureFetchDataWithRequestSuccess
} from './configure'
import Foos from './Foos'

describe('src | components | pages | hocs | withRequest', () => {

  beforeEach(() => {
    fetch.resetMocks()
  })

  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<Foos />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('functions', () => {
    describe('login with success', () => {
      it('should render test component when login is a success', done => {
        // when
        const store = configureTestStore()
        configureFetchDataWithRequestSuccess()

        // then
        mount(
          <Provider store={store}>
            <Foos />
          </Provider>
        )
      })
    })
  })
})
