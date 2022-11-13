const express = require('express')

const setupServer = (knex) => {
  const HOME_TABLE = 'home'
  const USERS_TABLE = 'users'
  const DEVICES_TABLE = 'devices'

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
    res.status(200).send(await knex.select().from(HOME_TABLE))
  })

  app.get('/home', async (req, res) => {
    res.status(200).send(await knex.select().from(HOME_TABLE))
  })

  app.get('/home/:id', async (req, res) => {
    res
      .status(200)
      .send(await knex.select().from(HOME_TABLE).where({ id: req.params.id }))
  })

  app.post('/home', async (req, res) => {
    knex(HOME_TABLE)
      .insert({ name: req.body.name })
      .then((res) => {
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    res.status(201).end()
  })

  app.patch('/home/:id', async (req, res) => {
    knex(HOME_TABLE)
      .returning('id')
      .where({ id: req.params.id })
      .update({ name: req.body.name })
      .then((res) => {
        resolve(res[0].id)
      })
    res.status(201).end()
  })

  app.delete('/home/:id', async (req, res) => {
    console.log('req.params.id:', req.params.id)
    const ret = await knex(HOME_TABLE)
      .where({ id: req.params.id })
      .delete()
      .catch((err) => {
        console.log(err)
      })
    res.status(204).end()
  })

  app.get('/users', async (req, res) => {
    res.status(200).send(await knex.select().from(USERS_TABLE))
  })

  app.get('/users/:id', async (req, res) => {
    res
      .status(200)
      .send(await knex.select().from(USERS_TABLE).where({ id: req.params.id }))
  })

  app.get('/users/home/:id', async (req, res) => {
    res
      .status(200)
      .send(
        await knex.select().from(USERS_TABLE).where({ home_id: req.params.id })
      )
  })

  app.post('/users', async (req, res) => {
    await knex(USERS_TABLE)
      .insert(req.body)
      .then((res) => {
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    res.status(201).end()
  })

  app.delete('/users/:id', async (req, res) => {
    console.log('req.params.id:', req.params.id)
    const ret = await knex(USERS_TABLE)
      .where({ id: req.params.id })
      .delete()
      .catch((err) => {
        console.log(err)
      })
    res.status(204).end()
  })

  app.patch('/users/:id', async (req, res) => {
    knex(USERS_TABLE)
      .returning('id')
      .where({ id: req.params.id })
      .update({ name: req.body.name })
      .then((res) => {
        resolve(res[0].id)
      })
    res.status(201).end()
  })

  app.get('/devices/', async (req, res) => {
    res.status(200).send(await knex.select().from(DEVICES_TABLE))
  })

  app.get('/devices/:id', async (req, res) => {
    res
      .status(200)
      .send(
        await knex.select().from(DEVICES_TABLE).where({ id: req.params.id })
      )
  })

  app.get('/devices/home/:id', async (req, res) => {
    res
      .status(200)
      .send(
        await knex
          .select()
          .from(DEVICES_TABLE)
          .where({ home_id: req.params.id })
      )
  })

  app.post('/devices', async (req, res) => {
    await knex(DEVICES_TABLE)
      .insert(req.body)
      .then((res) => {
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    res.status(201).end()
  })

  app.patch('/devices/:id', async (req, res) => {
    knex(DEVICES_TABLE)
      .returning('id')
      .where({ id: req.params.id })
      .update({ name: req.body.name })
      .then((res) => {
        resolve(res[0].id)
      })
    res.status(201).end()
  })

  app.delete('/devices/:id', async (req, res) => {
    console.log('req.params.id:', req.params.id)
    const ret = await knex(DEVICES_TABLE)
      .where({ id: req.params.id })
      .delete()
      .catch((err) => {
        console.log(err)
      })
    res.status(204).end()
  })
  return app
}

module.exports = { setupServer }
