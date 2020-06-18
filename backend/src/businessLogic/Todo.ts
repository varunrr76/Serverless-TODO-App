import * as uuid from 'uuid'

import { TodoAccess } from '../datalayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import { parseUserId } from '../auth/utils'
import { DataAccessResponse } from '../models/DataAccessResponse'

const todoAccess = new TodoAccess()

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  token: string
): Promise<DataAccessResponse> {
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

export async function deleteTodo(todoId: string) {
  return await todoAccess.deleteTodo(todoId)
}
