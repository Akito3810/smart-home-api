const data = require('../data')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('home')
    .del()
    .then(() => knex.raw(`select setval ('home_id_seq', 1, false);`))
    .then(() => knex('home').insert(data.home))
}
