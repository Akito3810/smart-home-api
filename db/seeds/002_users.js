const data = require('../data')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users')
    .del()
    .then(() => knex.raw(`select setval ('users_id_seq', 1, false);`))
    .then(() => knex('users').insert(data.users))
}
