import 'babel-polyfill'

import { getNextState } from '../getNextState'

describe('src | getNextState', () => {
  describe('default concatenation and replace of entities in the collections when isMergingArray:true isMutatinArray:true isMergingArray: false', () => {

    it('next data state is a new object from previous state', () => {
      // given
      const state = {}
      const method = 'GET'
      const patch = {}

      // when
      const nextState = getNextState(state, method, patch)

      // then
      expect(Object.is(nextState, state)).toBe(false)
    })

    it('next collection array is a new array from previous one', () => {
      // given
      const state = {
        books: []
      }
      const method = 'GET'
      const patch = {
        books: []
      }

      // when
      const nextState = getNextState(state, method, patch)

      // then
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.books, state.books)).toBe(false)
    })

    it('should concat new entity in the data array', () => {
      // given
      const state = {
        books: [{ id: 0, text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [{ id: 1, text: "you foo" }]
      }
      const expectedNextState = {
        books: [{ id: 0, text: "my foo" }, { id: 1, text: "you foo" }]
      }

      // when
      const nextState = getNextState(state, method, patch)

      // then
      expect(nextState).toMatchObject(expectedNextState)
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.foos, state.books)).toBe(false)
      expect(Object.is(nextState.books[0], state.books[0])).toBe(true)
    })

    it('should replace already existing entity in the data array', () => {
      // given
      const state = {
        books: [
          { id: 0, text: "I will be replaced!" }
        ]
      }
      const method = 'GET'
      const patch = {
        books: [
          { id: 0, text: "my refreshed foo" },
          { id: 1, text: "you foo" }
        ]
      }
      const expectedNextState = {
        books: [
          { id: 0, text: "my refreshed foo" },
          { id: 1, text: "you foo" }
        ]
      }

      // when
      const nextState = getNextState(state, method, patch)

      // then
      expect(nextState).toMatchObject(expectedNextState)
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.foos, state.books)).toBe(false)
      expect(Object.is(nextState.books[0], state.books[0])).toBe(false)
    })
  })

  describe('using mutate and merge configs', () => {

    it('should make the collection replaced when isMerginArray is false', () => {
      // given
      const state = {
        books: [{ id: 0, text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [{ id: 1, text: "you foo" }]
      }
      const expectedNextState = {
        books: [{ id: 1, text: "you foo" }]
      }
      const config = { isMerginArray: false }

      // when
      const nextState = getNextState(state, method, patch, config)

      // then
      expect(nextState).toMatchObject(expectedNextState)
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.foos, state.books)).toBe(false)
      expect(Object.is(nextState.books[0], state.books[0])).toBe(false)
    })

    it('should merge the new collection into the previous one without mutating array when isMutatingArray is false', () => {
      // given
      const state = {
        books: [{ id: 0, text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [{ id: 1, text: "you foo" }]
      }
      const expectedNextState = {
        books: [
          { id: 0, text: "my foo" },
          { id: 1, text: "you foo" }
        ]
      }
      const config = { isMutatingArray: false }

      // when
      const nextState = getNextState(state, method, patch, config)

      // then
      expect(nextState).toMatchObject(expectedNextState)
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.foos, state.books)).toBe(true)
      expect(Object.is(nextState.books[0], state.books[0])).toBe(false)
    })

    it('should mutate and merge already existing entity in the data array when isMergingDatum is true', () => {
      // given
      const state = {
        books: [{ id: 0, notReplacedText: "I will stay alive!", text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [
          { id: 0, mergedText: "I am new here", text: "my refreshed foo" },
          { id: 1, text: "you foo" }
        ]
      }
      const config = { isMergingDatum: true }
      const expectedNextState = {
        books: [
          { id: 0, mergedText: "I am new here", notReplacedText: "I will stay alive!", text: "my new foo" },
          { id: 1, text: "you foo" }
        ]
      }

      // when
      const nextState = getNextState(state, method, patch, config)

      // then
      expect(nextState).toMatchObject(expectedNextState)
      expect(Object.is(nextState, state)).toBe(false)
      expect(Object.is(nextState.foos, state.books)).toBe(false)
      expect(Object.is(nextState.books[0], state.books[0])).toBe(false)
    })
  })

  describe('using normalizer config', () => {
    it('normalize one entity at first level', () => {
      // given
      const state = {
        authors: [{ id: 0, name: "John Marxou" }],
        books: [{ authorId: 0, id: 0, text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [
          {
            author: { id: 1, name: "Edmond Frostan" },
            id: 1,
            text: "you foo"
          }
        ]
      }
      const expectedNextState = {
        authors: [
          { id: 0, name: "John Marxou" },
          { id: 1, name: "Edmond Frostan" }
        ],
        books: [
          { authorId: 0, id: 0, text: "my foo" },
          {
            authorId: 1,
            id: 1,
            text: "you foo"
          }
        ]
      }
      const config = {
        normalizer: {
          books: {
            normalizer: {
              author: "authors"
            }
          }
        }
      }

      // when
      const nextState = getNextState(state, method, patch, config)

      // then
      expect(nextState).toMatchObject(expectedNextState)
    })

    it('normalize entities at deep levels', () => {
      // given
      const state = {
        authors: [{ id: 0, name: "John Marxou" }],
        books: [{ authorId: 0, id: 0, text: "my foo" }]
      }
      const method = 'GET'
      const patch = {
        books: [
          {
            author: { id: 1, name: "Edmond Frostan" },
            id: 1,
            text: "you foo"
          }
        ]
      }
      const expectedNextState = {
        authors: [
          { id: 0, name: "John Marxou" },
          { id: 1, name: "Edmond Frostan" }
        ],
        books: [
          { authorId: 0, id: 0, text: "my foo" },
          {
            authorId: 1,
            id: 1,
            text: "you foo"
          }
        ]
      }
      const config = {
        normalizer: {
          books: {
            normalizer: {
              author: "authors"
            }
          }
        }
      }

      // when
      const nextState = getNextState(state, method, patch, config)

      // then
      expect(nextState).toMatchObject(expectedNextState)
    })


  })
})
