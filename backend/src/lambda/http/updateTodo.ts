import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { createLogger } from '../../utils/logger'

import { updateTodo } from '../../businessLogic/Todo'

const logger = createLogger('updatelogger')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  logger.info(`create request for ${JSON.stringify(todoid)} received!!`)

  const updateItemResp = await updateTodo(todoId, updatedTodo)

  return {
    statusCode: updateItemResp.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(updateItemResp.results)
  }
}
