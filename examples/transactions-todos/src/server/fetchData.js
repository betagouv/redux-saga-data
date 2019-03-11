import get from 'lodash.get'
import uuid from 'uuid'

import todos from './todos'

function fetchData (method, path, config) {

  console.log('method, path, config', method, path, config)

  if (/todos\/?(.*)$/.test(path)) {

    if (method === 'GET') {
      return { data: todos  }
    }

    if (method === 'POST') {
      const todo = Object.assign({
        completed: false,
        id: uuid(),
        text: null
      }, config.body)
      todos.push(todo)
      return { data: todo  }
    }

    if (method === 'PATCH') {
      const todoId = get(path.match(/todos\/(.*)$/), '1')
      if (todoId) {
        const todo = todos.find(todo => todo.id === todoId)
        Object.assign(todo, config.body)
        return { data: todo  }
      }
      return { todo: "No such todo id"  }
    }

    if (method === 'DELETE') {
      const todoId = get(path.match(/todos\/(.*)$/), '1')
      if (todoId) {
        const todoIndex = todos.findIndex(todo => todo.id === todoId)
        delete todos[todoIndex]
        return { data: { id: todoId }  }
      }
      return { todo: "No such todo id"  }
    }

  }

  return { global: "No such path " }
}

export default fetchData
