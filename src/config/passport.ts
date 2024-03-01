import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { model } from 'mongoose'
import { User } from 'models'
const UserModel = model<User>('User')

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      console.log('signup0')
      UserModel.findOne({ email: req.body.email })
        .then((exists) => {
          if (exists) {
            throw Error('Email is already token')
          }
          const username = req.body.name
          return UserModel.create({ username, email })
        })
        .then((user) => {
          if (!user) {
            throw Error('Failed to create user')
          }
          user.setPassword(password)
          return user.save()
        })
        .then((user) => {
          return done(null, user)
        })
        .catch(done)
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      UserModel.findOne({ email: email })
        .then((user: User | null) => {
          if (!user || !user.validPassword(password)) {
            return done(
              {
                errors: { message: 'Email or password is invalid' },
              },
              null
            )
          }

          return done(null, user)
        })
        .catch(done)
    }
  )
)
