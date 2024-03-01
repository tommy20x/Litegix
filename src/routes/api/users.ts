import { body } from 'express-validator'
import { model } from 'mongoose'
import { Router, Request, Response, NextFunction } from 'express'
import { User } from 'models'
import auth from 'routes/auth'
import * as authService from 'services/auth.service'

const router = Router()
const UserModel = model<User>('User')

router.get(
  '/user',
  auth.required,
  function (req: Request, res: Response, next: NextFunction) {
    UserModel.findById(req.payload.id)
      .then((user: User | null) => {
        if (!user) {
          return res.sendStatus(401)
        }

        return res.json({ user: user.toAuthJSON() })
      })
      .catch(next)
  }
)

router.put(
  '/user',
  auth.required,
  function (req: Request, res: Response, next: NextFunction) {
    UserModel.findById(req.payload.id)
      .then(function (user) {
        if (!user) {
          return res.sendStatus(401)
        }

        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
          user.username = req.body.user.username
        }
        if (typeof req.body.user.email !== 'undefined') {
          user.email = req.body.user.email
        }
        if (typeof req.body.user.bio !== 'undefined') {
          user.bio = req.body.user.bio
        }
        if (typeof req.body.user.image !== 'undefined') {
          user.image = req.body.user.image
        }
        if (typeof req.body.user.password !== 'undefined') {
          user.setPassword(req.body.user.password)
        }

        return user.save().then(function () {
          return res.json({ user: user.toAuthJSON() })
        })
      })
      .catch(next)
  }
)

router.post(
  '/users/login',
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.login
)

router.post(
  '/users/signup',
  body('name').notEmpty(),
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.signup
)

export default router
