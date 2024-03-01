import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/app'

chai.use(chaiHttp)
chai.should()

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNWU4OGRmOTNlMjI1MjBlMDEyMjUyMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2Mzg3NzA3ODQuMjc1LCJpYXQiOjE2MzM1ODY3ODR9.Ajg0FvoARctjeDJMSO6RwC1YFTmPyV-5RxFPGgBIUhY'

describe('settings/apikey', () => {
  it('it should get apikeys', (done) => {
    chai
      .request(server)
      .get('/settings/apikey')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)

        const { apiKeys } = res.body.data
        apiKeys.should.have.property('enableAccess')
        apiKeys.should.have.property('apiKey')
        apiKeys.should.have.property('secretKey')
        done()
      })
  })

  it('it should upate apiKey', (done) => {
    chai
      .request(server)
      .put('/settings/apikey/apiKey')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should upate secretKey', (done) => {
    chai
      .request(server)
      .put('/settings/apikey/secretKey')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should enable accessKey', (done) => {
    chai
      .request(server)
      .post('/settings/apikey/enableaccess')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        state: true,
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should add allowed IP address', (done) => {
    chai
      .request(server)
      .post('/settings/apikey/ipaddr')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        address: '152.11.22.33',
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should get allowed IP addresses', (done) => {
    chai
      .request(server)
      .get('/settings/apikey/ipaddr')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })
})
