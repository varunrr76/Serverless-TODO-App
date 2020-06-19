import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import { getTodos } from '../../businessLogic/Todo'

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info(`get todos request received for the authenticated user!!`)
  const token: string = event.headers.Authorization.split(' ')[1]

  const getTodoResponse = await getTodos(token)

  return {
    statusCode: getTodoResponse.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: getTodoResponse.results
  }
}
