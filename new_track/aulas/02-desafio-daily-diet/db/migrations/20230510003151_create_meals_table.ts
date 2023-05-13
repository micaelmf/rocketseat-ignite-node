import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.date('date').defaultTo(knex.fn.now())
    table.time('hour').defaultTo(knex.fn.now())
    table.boolean('is_diet').defaultTo(true)
    table.integer('user_id').unsigned().notNullable()
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    table.timestamp('updated_at')

    // Relationships
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
