const chai = require('chai')
const { request } = require('express')
const { setupServer } = require('../src/server')
chai.should()
const server = setupServer()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
describe('Hello Server', () => {
  let request
  beforeEach(() => {
    request = chai.request(server)
  })
  afterEach(() => {
    request.close()
  })

  describe('Hello', () => {
    it('Hello', async () => {
      const res = await request.get('/')
      res.text.should.deep.equal('Hello')
    })
    it('Hello', async () => {
      const res = await request.get('/hello')
      res.body.should.deep.equal([
        { id: 1, name: 'myhouse' },
        { id: 2, name: 'sweethome' },
        { id: 3, name: 'greathome' },
      ])
    })
  })
})
