import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../datalayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  token: string
): Promise<TodoItem> {
  const userId = await parseUserId(token)
  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    ...createTodoRequest,
    done: false,
    createdAt: new Date().toISOString()
  })
}
