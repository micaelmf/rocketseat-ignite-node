import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'
import { MealRequestBody } from '../@types/knex'

export async function checkUserExists(
  request: FastifyRequest<{ Body: MealRequestBody }>,
  reply: FastifyReply,
) {
  const users = await knex('users').where('id', request.body.userId).select()

  if (users.length === 0) {
    return reply.status(401).send({
      error: 'User not found',
    })
  }
}
