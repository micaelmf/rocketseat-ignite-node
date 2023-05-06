import 'dotenv/config'
import { string, z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  const message = 'Invalid environment variables!'
  console.error(message, _env.error.format())
  throw new Error(message)
}

export const env = _env.data
