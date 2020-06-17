import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../datalayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

// import {get} from '../auth/utils'

const todoAccess = new TodoAccess()

// add userid
export async function createTodo(
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const userId = '23'
  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    ...createTodoRequest,
    done: false,
    createdAt: new Date().toISOString()
  })
}
