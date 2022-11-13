/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('devices', function (table) {
    table.increments('id').primary() // Set this column as the primary key
    table.string('description', 32).notNullable()
    table.string('name', 32).notNullable()
    table.string('status', 32).notNullable()
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
  return knex.schema.dropTable('devices')
}
