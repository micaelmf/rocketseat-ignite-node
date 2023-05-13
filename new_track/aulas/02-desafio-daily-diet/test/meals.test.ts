import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { knex } from '../src/database'
import crypto from 'node:crypto'

// Tests E2E

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    // resetDatabase()
    await app.close()
  })

  beforeEach(() => {
    resetDatabase()
  })

  it('should be able to create a new meal', async () => {
    const userId = await createUser()

    await request(app.server)
      .post('/meals')
      .send({
        id: crypto.randomUUID(),
        name: 'Café com torradas integrais',
        description: 'primeira refeição',
        date: '2023-05-13',
        hour: '06:00',
        userId,
        isDiet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals of a user', async () => {
    const userId = await createUser()
    const numberMeals = 3

    for (let i = 0; i < numberMeals; i++) {
      await createMeal(userId)
    }

    const response = await request(app.server).get(`/meals/users/${userId}`)

    expect(response.status).toBe(200)
    expect(response.body.meals).toHaveLength(numberMeals)
  })

  it('should be able to get especific meal', async () => {
    const mealId = await createMeal()

    const response = await request(app.server).get(`/meals/${mealId}`)

    console.log(response.body)

    expect(response.status).toBe(200)
    expect(response.body.meals).toEqual(
      expect.objectContaining({
        name: 'Café da manhã',
        description: 'Café com torradas integrais',
        hour: '06:00',
      }),
    )
  })

  it('should be able to get the metrics of user', async () => {
    const userId = await createUser()

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name: 'Café da manhã',
      description: 'Café com torradas integrais',
      date: new Date('2023-05-13'),
      hour: '06:00',
      user_id: userId.toString(),
      is_diet: true,
    })

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name: 'Lanche da manhã',
      description: 'Maçã, aveia e mel',
      date: new Date('2023-05-13'),
      hour: '09:00',
      user_id: userId.toString(),
      is_diet: true,
    })

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name: 'Almoço',
      description: 'Purê, frango e salada',
      date: new Date('2023-05-13'),
      hour: '12:00',
      user_id: userId.toString(),
      is_diet: true,
    })

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name: 'Lasanha da mãe',
      description: 'bem caprichada',
      date: new Date('2023-05-13'),
      hour: '19:00',
      user_id: userId.toString(),
      is_diet: false,
    })

    const response = await request(app.server)
      .get(`/meals/users/${userId}/metrics`)
      .expect(200)

    expect(response.body.metrics).toEqual({
      total_meals: 4,
      diet_meals: 3,
      not_diet_meals: 1,
    })
  })
})

function resetDatabase() {
  execSync('npx knex migrate:rollback --all')
  execSync('npx knex migrate:latest')
}

async function createUser() {
  const id = crypto.randomUUID()
  await knex('users').insert({
    id,
    nickname: 'Test User',
    session_id: 'test-session-id',
  })
  return id
}

async function createMeal(id = '') {
  const mealId = crypto.randomUUID()
  const userId = await createUser()

  await knex('meals').insert({
    id: mealId,
    name: 'Café da manhã',
    description: 'Café com torradas integrais',
    date: new Date('2023-05-13'),
    hour: '06:00',
    user_id: id ? id.toString() : userId.toString(),
    is_diet: false,
  })
  return mealId
}
