const data = require('../data')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('devices')
    .del()
    .then(() => knex.raw(`select setval ('devices_id_seq', 1, false);`))
    .then(() => knex('devices').insert(data.devices))
}
