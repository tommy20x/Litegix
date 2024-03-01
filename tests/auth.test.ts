import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/app'

chai.use(chaiHttp)
chai.should()

describe('authentication', () => {
  it('it should success to signup', (done) => {
    chai
      .request(server)
      .post('/signup')
      .send({
        name: 'admin',
        email: 'admin@gmail.com',
        password: 'admin2021',
      })
      .end((err, res) => {
        //res.should.have.status(200)
        done()
      })
  })

  it('it should success to signup', (done) => {
    chai
      .request(server)
      .post('/signup')
      .send({
        name: 'litegix',
        email: 'litegix@gmail.com',
        password: 'litegix2021',
      })
      .end((err, res) => {
        //res.should.have.status(200)
        done()
      })
  })

  it('it should success to login', (done) => {
    chai
      .request(server)
      .post('/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin2021',
      })
      .end((err, res) => {
        //res.should.have.status(200)
        done()
      })
  })
})
