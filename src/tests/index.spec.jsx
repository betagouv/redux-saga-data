import 'babel-polyfill'

import { mount, shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import { configureTestStore,
  configureFetchDataWithRequestFail,
  configureFetchDataWithRequestSuccess
} from './configure'
import Foos, { RawFoos } from './Foos'

describe('src | components | pages | hocs | withRequest', () => {

  beforeEach(() => {
    fetch.resetMocks()
  })

  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<RawFoos dispatch={jest.fn()} foos={[]} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('mount with request', () => {
    describe('request with success', () => {
      it('should render test component whith foo items', done => {
        // when
        const store = configureTestStore()
        configureFetchDataWithRequestSuccess()

        // then
        mount(
          <Provider store={store}>
            <Foos onSuccessUpdateCallback={done} />
          </Provider>
        )
      })
    })

    describe('request with fail', () => {
      it('should render test component whith no foo items', done => {
        // when
        const store = configureTestStore()
        configureFetchDataWithRequestFail()

        // then
        mount(
          <Provider store={store}>
            <Foos onFailUpdateCallback={done} />
          </Provider>
        )
      })
    })
  })
})
