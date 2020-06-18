import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import { DataAccessResponse } from '../models/DataAccessResponse'

const logger = createLogger('TodoAccess')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODO_TABLE
  ) {}

  async getAllGroups(): Promise<TodoItem[]> {
    console.log('Getting all groups')

    const result = await this.docClient
      .scan({
        TableName: this.todoTable
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<DataAccessResponse> {
    var resp
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todoItem
      })
      .promise()
      .then(() => {
        resp = {
          status: 201,
          message: 'Successfully Created!',
          results: [todoItem]
        }
      })
      .catch((err) => {
        resp = {
          status: 500,
          message: `Failed to create todo!! Check with DynamoDB connection. \n ${err}`,
          results: []
        }
      })
    return resp as DataAccessResponse
  }

  async deleteTodo(todoId: string): Promise<DataAccessResponse> {
    var resp
    if (await this.todoItemExists(todoId)) {
      resp = {
        status: 404,
        message: 'todoId Not Present',
        results: []
      }
    } else {
      await this.docClient
        .delete({
          TableName: this.todoTable,
          Key: {
            todoId: todoId
          }
        })
        .promise()
        .then(() => {
          resp = {
            status: 200,
            message: 'Successfully Deleted!',
            results: [{ todoId: todoId }]
          }
        })
        .catch((err) => {
          resp = {
            status: 500,
            message: `Failed to delete todo!! Check with DynamoDB connection. \n ${err}`,
            results: []
          }
        })
    }
    return resp as DataAccessResponse
  }

  async updateTodo(
    todoId: string,
    updatedTodo: TodoUpdate
  ): Promise<DataAccessResponse> {
    var resp
    if (await this.todoItemExists(todoId)) {
      resp = {
        status: 404,
        message: 'todoId Not Present',
        results: []
      }
    } else {
      logger.info(`${JSON.stringify(updatedTodo.name)}`)
      await this.docClient
        .update({
          TableName: this.todoTable,
          Key: {
            todoId: todoId
          },
          UpdateExpression: 'set #task_name = :n, dueDate = :dD, done = :d',
          ExpressionAttributeValues: {
            ':n': updatedTodo.name,
            ':dD': updatedTodo.dueDate,
            ':d': updatedTodo.done
          },
          ExpressionAttributeNames: {
            '#task_name': 'name'
          },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()
        .then((data) => {
          logger.info(`Inside the condition 2 and then ${JSON.stringify(data)}`)
          resp = {
            status: 200,
            message: 'Successfully Updated!',
            results: [data]
          }
        })
        .catch((err) => {
          logger.error(`${err}`)
          resp = {
            status: 500,
            message: `Failed to update todo!! Check with DynamoDB connection. \n ${err}`,
            results: []
          }
        })
    }
    return resp as DataAccessResponse
  }

  async todoItemExists(todoId: string) {
    const result = await this.docClient
      .get({
        TableName: this.todoTable,
        Key: {
          todoId: todoId
        }
      })
      .promise()

    logger.info(`${JSON.stringify(result)}`)

    return JSON.stringify(result) === '{}'
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  logger.info(`Connecting to DynamoDB`)
  return new AWS.DynamoDB.DocumentClient()
}
