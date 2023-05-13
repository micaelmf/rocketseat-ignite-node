import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('nickname').notNullable()
    table.uuid('session_id')
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
