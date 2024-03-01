import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as system from 'services/system.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => system.getDeploymentKeys(server))
)

router.post(
  '/',
  auth.required,
  body('userId').isString(),
  validate,
  ch(({ server, body }) => system.storeDeploymentKey(server, body.userId))
)

export default router
