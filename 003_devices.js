const data = require('../data')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('devices').del()
  await knex('devices').insert(data.devices)
}
