import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/app'

chai.use(chaiHttp)
chai.should()

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNWU4OGRmOTNlMjI1MjBlMDEyMjUyMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2Mzg3NzA3ODQuMjc1LCJpYXQiOjE2MzM1ODY3ODR9.Ajg0FvoARctjeDJMSO6RwC1YFTmPyV-5RxFPGgBIUhY'

describe('settings/notification', () => {
  it('it should subscribe newsletters', (done) => {
    chai
      .request(server)
      .post('/settings/notifications/newsletters/subscribe')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        subscription: true,
        announchment: true,
        blog: true,
        events: false,
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should unsbscribe newsletters', (done) => {
    chai
      .request(server)
      .post('/settings/notifications/newsletters/unsubscribe')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })

  it('it should get notifications', (done) => {
    chai
      .request(server)
      .get('/settings/notifications')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        res.body.data.should.have.property('newsletters')
        done()
      })
  })

  /*it('it should add channel', (done) => {
    chai
      .request(server)
      .post('/settings/notifications/channels')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        service: 'email',
        name: 'litegix',
        content: 'litegix@admin.com',
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        done()
      })
  })*/

  it('it should get channels', (done) => {
    chai
      .request(server)
      .get('/settings/notifications/channels')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        res.body.data.should.have.property('channels')
        done()
      })
  })
})
