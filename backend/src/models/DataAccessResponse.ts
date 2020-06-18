import { TodoItem } from './TodoItem'

export interface DataAccessResponse {
  status: number
  results: TodoItem[]
}
