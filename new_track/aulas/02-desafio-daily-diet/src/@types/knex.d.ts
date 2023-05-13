// eslint-disable-next-line
import { knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      nickname: string
      session_id?: string
      created_at: Date
      updated_at: Date
    }
    meals: {
      id: string
      name: string
      description: string
      date: Date
      hour: string
      is_diet: boolean
      user_id: string
      created_at: Date
      updated_at: Date
    }
  }
}

export interface MealRequestBody {
  id: string
  name: string
  description: string
  date: Date
  hour: string
  isDiet: boolean
  userId: string
}

export interface RouteParams {
  id: string
}
