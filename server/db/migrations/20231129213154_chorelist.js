import { DateTime } from 'luxon'

export async function up(knex) {
  return knex.schema.createTable('chore_list', (table) => {
    table.integer('chores_id')
    table.integer('user_id')
    table.date('due')
    table.date('assigned').defaultsTo(DateTime.now().toISODate())
    table.boolean('is_completed').defaultsTo(false)
    table.date('completed')
    table.boolean('reviewed').defaultsTo(false)
    // table.foreign('id').references('users.family_id').onDelete('cascade')
    // table.foreign('id').references('jobs.family_id').onDelete('cascade')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('chore_list')
}
