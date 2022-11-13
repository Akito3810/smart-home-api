const chai = require('chai')
const { request } = require('express')
const { setupServer } = require('../src/server')
chai.should()

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const config = require('../knexfile')
const knex = require('knex')(config)
const server = setupServer(knex)

const { expect } = require('chai')

const HOME_TABLE = 'home'
const USERS_TABLE = 'users'
const DEVICES_TABLE = 'devices'

let last_val_home
let last_val_users
let last_val_devices
describe('Smart Home Server', () => {
  let request
  beforeEach(() => {
    request = chai.request(server)
  })
  afterEach(() => {
    request.close()
  })

  before(async () => {
    await knex(HOME_TABLE)
      .insert([
        { id: 9999, name: 'hoge1' },
        { id: 8888, name: 'hoge2' },
        { id: 7777, name: 'hoge3' },
      ])
      .then((res) => {
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })

    await knex
      .raw(`select * from home_id_seq;`)
      .then((res) => {
        last_val_home = res.rows[0].last_value
      })
      .catch((err) => {
        console.log(err)
      })
    await knex
      .raw(`select * from users_id_seq;`)
      .then((res) => {
        last_val_users = res.rows[0].last_value
      })
      .catch((err) => {
        console.log(err)
      })
    await knex
      .raw(`select * from devices_id_seq;`)
      .then((res) => {
        last_val_devices = res.rows[0].last_value
      })
      .catch((err) => {
        console.log(err)
      })
  })

  // after(async () => {
  //   await knex.raw(`select setval ('users_id_seq', ${last_val_home}, true);`)
  //   await knex.raw(`select setval ('users_id_seq', ${last_val_home}, true);`)
  //   await knex.raw(`select setval ('users_id_seq', ${last_val_home}, true);`)
  // })

  describe('setup', () => {
    it('should connect to database', () => {
      knex.raw('select 1 as result').catch(() => {
        assert.fail('unable to connect to database')
      })
    })

    it('has run the initial migration', () => {
      knex(HOME_TABLE)
        .select()
        .catch(() => assert.fail('product table is not found.'))
    })
  })

  describe('Hello', () => {
    it('Hello', async () => {
      const res = await request.get('/')
      res.text.should.deep.equal('Hello')
    })
    it('Hello', async () => {
      const res = await request.get('/hello')
      res.body.should.deep.equal(await knex.select().from(HOME_TABLE))
    })
  })

  describe('Home', () => {
    describe('GET Home', () => {
      it('should get home', async () => {
        const res = await request.get('/home')
        res.body.should.deep.equal(await knex.select().from(HOME_TABLE))
      })

      it('should get home by id', async () => {
        const res = await request.get('/home/1')
        res.body[0].should.deep.equal({ id: 1, name: 'myhouse' })
      })
    })

    describe('POST Home', () => {
      after(async () => {
        await knex
          .from(HOME_TABLE)
          .where({ name: 'royalhome' })
          .del()
          .catch((error) => console.error(error))

        await knex.raw(`select setval ('home_id_seq', ${last_val_home}, true);`)
      })
      it('should register home', async () => {
        const target = { name: 'royalhome' }
        const res = await request.post('/home').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(HOME_TABLE)
          .where({ name: 'royalhome' })
        console.log(expect)
        should.not.equal(expect[0].id, null)
      })

      after(async () => {
        await knex
          .from(HOME_TABLE)
          .where({ id: 9999 })
          .del()
          .catch((error) => console.error(error))

        console.log('after delete  9999')
      })
    })

    describe('PATCH Home', () => {
      it('should change home', async () => {
        const target = { name: 'royalityhome' }
        const res = await request.patch('/home/7777').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(HOME_TABLE)
          .where({ name: 'royalityhome' })
        console.log(expect[0])
        should.not.equal(expect[0], null)
      })

      after(async () => {
        await knex
          .from(HOME_TABLE)
          .where({ id: 7777 })
          .del()
          .catch((error) => console.error(error))
        console.log('after delete 7777')
      })
    })

    describe('DELETE /home/:id', () => {
      it('should delete home', async () => {
        const res = await request.delete('/home/8888').send()
        res.should.have.status(204)
      })
    })
  })

  describe('Users', () => {
    describe('GET Users', () => {
      it('should get user', async () => {
        const res = await request.get('/users')
        res.body.should.deep.equal(await knex.select().from(USERS_TABLE))
      })

      it('should get users by id', async () => {
        const res = await request.get('/users/1')
        res.body[0].name.should.deep.equal('Takeshi Tada')
      })

      it('should get users by home', async () => {
        const res = await request.get('/users/home/1')
        res.body.length.should.deep.equal(2)
      })
    })

    describe('POST Users', () => {
      after(async () => {
        await knex
          .from(USERS_TABLE)
          .where({ name: 'NAMEXXXXXXXXXX' })
          .del()
          .catch((error) => console.error(error))
        console.log('after royalhome')
        await knex.raw(
          `select setval ('users_id_seq', ${last_val_users}, true);`
        )
      })
      it('should register users', async () => {
        const target = {
          name: 'NAMEXXXXXXXXXX',
          userName: 'XXXXX',
          email: 'XXXXX@example.com',
          home_id: '3',
        }
        const res = await request.post('/users').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(USERS_TABLE)
          .where({ name: 'NAMEXXXXXXXXXX' })
        console.log('user regist:', expect)
        should.not.equal(expect[0].id, null)
      })
    })

    describe('PATCH User', () => {
      before(async () => {
        await knex(USERS_TABLE)
          .insert({
            id: 666666,
            name: 'NAMEffff',
            userName: 'XXXXX',
            email: 'XXXXX@example.com',
            home_id: '3',
          })
          .then((res) => {
            // console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })

      it('should change user', async () => {
        const target = { name: 'NAMEYYYY' }
        const res = await request.patch('/home/666666').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(USERS_TABLE)
          .where({ name: 'NAMEYYYY' })
        console.log('change user', expect[0])
        should.not.equal(expect[0], null)
      })

      after(async () => {
        await knex
          .from(USERS_TABLE)
          .where({ id: 666666 })
          .del()
          .catch((error) => console.error(error))
        console.log('after delete 666666')
      })
    })

    describe('DELETE /users/:id', () => {
      before(async () => {
        await knex(USERS_TABLE)
          .insert({
            id: 555555,
            name: 'aaaaaa',
            userName: 'XXXXX',
            email: 'XXXXX@example.com',
            home_id: '3',
          })
          .then((res) => {
            // console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      it('should delete users', async () => {
        const res = await request.delete('/users/555555').send()
        res.should.have.status(204)
      })
    })
  })

  describe('Devices', () => {
    describe('GET Devices', () => {
      it('should get devices', async () => {
        const res = await request.get('/devices')
        res.body.should.deep.equal(await knex.select().from(DEVICES_TABLE))
      })

      it('should get devices by id', async () => {
        const res = await request.get('/devices/1')
        console.log(res.body)
        res.body[0].name.should.deep.equal('PC')
      })

      it('should get devices by home', async () => {
        const res = await request.get('/devices/home/1')
        res.body.length.should.deep.equal(2)
      })
    })

    describe('POST Devices', () => {
      after(async () => {
        await knex
          .from(DEVICES_TABLE)
          .where({ name: 'Test Devices' })
          .del()
          .catch((error) => console.error(error))
        await knex.raw(
          `select setval ('devices_id_seq', ${last_val_devices}, true);`
        )
      })
      it('should register devices', async () => {
        const target = {
          home_id: '3',
          name: 'Test Devices',
          status: '1',
          description: 'リビングに置いてあるメインPC',
        }
        const res = await request.post('/devices').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(DEVICES_TABLE)
          .where({ name: 'Test Devices' })
        console.log('register devices', expect)
        should.not.equal(expect[0], null)
      })
    })

    describe('PATCH Devices', () => {
      before(async () => {
        await knex(DEVICES_TABLE)
          .insert({
            id: 44444,
            home_id: '3',
            name: 'Test Devices2',
            status: '1',
            description: 'リビングに置いてあるメインPC',
          })
          .then((res) => {
            // console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })

      it('should change devices', async () => {
        const target = { name: 'Test Devices3' }
        const res = await request.patch('/home/44444').send(target)
        res.should.have.status(201)
        const expect = await knex
          .select()
          .from(DEVICES_TABLE)
          .where({ name: 'Test Devices3' })
        console.log(expect[0])
        should.not.equal(expect[0], null)
      })

      after(async () => {
        await knex
          .from(DEVICES_TABLE)
          .where({ id: 44444 })
          .del()
          .catch((error) => console.error(error))
        console.log('after delete 44444')
      })
    })

    describe('DELETE /users/:id', () => {
      before(async () => {
        await knex(DEVICES_TABLE)
          .insert({
            id: 33333,
            home_id: '3',
            name: 'Test Devices Delete',
            status: '1',
            description: 'リビングに置いてあるメインPC',
          })
          .then((res) => {
            // console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      it('should delete users', async () => {
        const res = await request.delete('/users/33333').send()
        res.should.have.status(204)
      })

      after(async () => {
        await knex
          .from(DEVICES_TABLE)
          .where({ id: 33333 })
          .del()
          .catch((error) => console.error(error))
        console.log('after delete 33333')
      })
    })
  })
})
