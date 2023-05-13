import { FastifyInstance, FastifyRequest } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { checkUserExists } from '../middlewares/CheckUserExists'
import { RouteParams, MealRequestBody } from '../@types/knex'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkUserExists],
    },
    async (request: FastifyRequest<{ Body: MealRequestBody }>, reply) => {
      const { name, description, date, hour, isDiet, userId } = request.body

      await knex('meals').insert({
        id: crypto.randomUUID(),
        name,
        description,
        date,
        hour,
        is_diet: isDiet,
        user_id: userId,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/users/:id',
    async (request: FastifyRequest<{ Params: RouteParams }>, reply) => {
      console.log('request.params.id', request.params.id)
      const meals = await knex('meals')
        .where('user_id', request.params.id)
        .select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    async (request: FastifyRequest<{ Params: RouteParams }>, reply) => {
      const meals = await knex('meals').where('id', request.params.id).first()

      return { meals }
    },
  )

  app.get(
    '/users/:id/metrics',
    async (request: FastifyRequest<{ Params: RouteParams }>) => {
      const metrics = await knex('meals')
        .where('user_id', request.params.id)
        .select(
          knex.raw('count(id) as total_meals'),
          knex.raw('count(case when is_diet then 1 end) as diet_meals'),
          knex.raw('count(case when not is_diet then 1 end) as not_diet_meals'),
        )
        .first()

      return { metrics }
    },
  )

  app.put(
    '/:id',
    async (
      request: FastifyRequest<{ Params: RouteParams; Body: MealRequestBody }>,
      reply,
    ) => {
      const { name, description, date, hour, isDiet, userId } = request.body

      await knex('meals')
        .where('id', request.params.id)
        .update({
          name,
          description,
          date,
          hour,
          is_diet: isDiet,
          user_id: userId,
          updated_at: knex.raw('CURRENT_TIMESTAMP'),
        })

      reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    async (request: FastifyRequest<{ Params: RouteParams }>, reply) => {
      await knex('meals').where('id', request.params.id).delete()

      reply.status(204).send()
    },
  )
}
