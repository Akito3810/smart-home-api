const { setupServer } = require('./server')
const config = require('../knexfile')
const knex = require('knex')(config)

const app = setupServer(knex)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server is running!!! ON PORT:', PORT)
})
