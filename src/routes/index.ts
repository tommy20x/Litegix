import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { validate } from 'routes/helper'
import api from './api'
import admin from './admin'
import auth from './auth'
import settings from './settings'
import servers from './servers'
import subscriptions from './subscriptions'
import payment from './payment'
import * as authService from 'services/auth.service'
import backup from './backup'

const router = Router()
// router.get('/', (req: Request, res: Response) => {
//   res.send('Litegix')
// })

router.use('/admin', admin)
router.use('/api', api)
router.use('/settings', settings)
router.use('/servers', servers)
router.use('/subscriptions', subscriptions)
router.use('/payment', payment)
router.use('/backup', backup)

router.post(
  '/login',
  body('email').notEmpty(),
  body('password').notEmpty(),
  validate,
  authService.login
)

router.post(
  '/signup',
  body('name').notEmpty(),
  body('email').notEmpty(),
  body('password').notEmpty(),
  validate,
  authService.signup
)

router.get('/verify', auth.required, authService.verify)

router.get('/logout', authService.logout)

// request user verify
//router.post('/verify/:userId/:verifyCode', authService.userVerify)

router.use(function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: err.array(), //TODO~~~~~~~~~~~
    })
  }

  return next(err)
})

/*const cryptoService = require('../services/crypto')
const encrypted = cryptoService.encrypt("Hello World. www.maazone.com!!!192020$$$###")
const decrypted = cryptoService.decrypt(encrypted)
console.log('crypto', encrypted, decrypted)*/

export default router
