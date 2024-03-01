import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/app'

chai.use(chaiHttp)
chai.should()

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNWU4OGRmOTNlMjI1MjBlMDEyMjUyMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE2Mzg3NzA3ODQuMjc1LCJpYXQiOjE2MzM1ODY3ODR9.Ajg0FvoARctjeDJMSO6RwC1YFTmPyV-5RxFPGgBIUhY'

describe('settings/profile', () => {
  it('it should get user profile information', (done) => {
    chai
      .request(server)
      .get('/settings/profile')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(true)
        res.body.should.have.property('data')

        const data = res.body.data
        data.should.have.property('user')
        data.should.have.property('company')

        const user = data.user
        user.username.should.equal('admin')
        user.email.should.equal('admin@gmail.com')
        done()
      })
  })

  it('it should failed to update profile', (done) => {
    chai
      .request(server)
      .post('/settings/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'test@gmail.com',
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(422)
        done()
      })
  })

  it('it should success to update profile', (done) => {
    chai
      .request(server)
      .post('/settings/profile')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'admin@gmail.com',
        name: 'admin',
        timezone: 'UTC',
        loginNotification: true,
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        done()
      })
  })

  it('it should success to update company info', (done) => {
    chai
      .request(server)
      .post('/settings/profile/company')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Upwork',
        address1: 'US',
        address2: 'Losancel',
        city: 'NewYork',
        postal: 9087,
        state: 'tcey',
        country: 'United State',
        tax: 1122,
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        done()
      })
  })

  it('it should fail to update user password', (done) => {
    chai
      .request(server)
      .post('/settings/account/password')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        current_password: 'unknown_password',
        password: 'new_password',
      })
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200)
        res.body.should.have.property('success').equal(false)
        res.body.should.have.property('message').equal('Password mismatch')
        done()
      })
  })

  it('it should success to update user password', (done) => {
    chai
      .request(server)
      .post('/settings/account/password')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        current_password: 'admin2021',
        password: 'admin2021_new',
      })
      .end((err, res) => {
        console.log(res.body)
        //res.should.have.status(200)
        //res.body.should.have.property('success').equal(true)
        done()
      })
  })
})
