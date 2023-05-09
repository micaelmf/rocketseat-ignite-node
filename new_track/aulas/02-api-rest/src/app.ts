import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

/**
 * Um hook, que unciona como um middleware de escopo. Neste caso está no escopo global,
 * mas também pode ser usdo no escopo das rotas (plugins)
 */
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
