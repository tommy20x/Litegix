import { Router } from 'express'
import { body } from 'express-validator'
import { model } from 'mongoose'
import { Server } from 'models/server.model'
import users from './users'
import servers from './servers'
import * as authService from 'services/auth.service'
import plans from './plans'
import payments from './payments'
const Server = model<Server>('Server')
const router = Router()

router.use('/users', users)
router.use('/servers', servers)
router.use('/plans', plans)
router.use('/payments', payments)

router.post(
  '/login',
  body('email').notEmpty(),
  body('password').notEmpty(),
  authService.login
)

export default router
