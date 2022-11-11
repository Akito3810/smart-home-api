const express = require('express')
const knex = require('./knex')

const setupServer = () => {
  const app = express()

  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  app.get('/', (req, res) => {
    res.format({
      'text/html': () => {
        res.send('Hello')
      },
    })
  })

  app.get('/hello', async (req, res) => {
    res.send(await knex.select().from('home'))
  })

  return app
}

module.exports = { setupServer }
