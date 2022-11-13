/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary() // Set this column as the primary key
    table.string('name', 32).notNullable()
    table.string('userName', 32).notNullable()
    table.string('email', 32).notNullable()
    table.integer('home_id').unsigned()
    table
      .foreign('home_id')
      .references('id')
      .inTable('home')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable('users')
}
