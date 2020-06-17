import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createLogger } from '../../utils/logger'

const logger = createLogger('logger')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  logger.log('info', `called logger! ${newTodo}`)

  return undefined
}
