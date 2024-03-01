import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as serverSvc from 'services/server.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ payload }) => serverSvc.getServers(payload.id))
)

router.get(
  '/create',
  auth.required,
  ch(() => serverSvc.createServer())
)

router.post(
  '/',
  auth.required,
  body('name').notEmpty(),
  body('address').isIP(4),
  body('webserver').notEmpty(),
  body('database').notEmpty(),
  body('phpVersion').notEmpty(),
  validate,
  ch(({ payload, body }) => serverSvc.storeServer(payload.id, body))
)

export default router
