import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as systemService from 'services/system.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => systemService.getSystemUsers(server))
)

router.get(
  '/:userId',
  auth.required,
  ch(({ server, params }) =>
    systemService.getSystemUserById(server, params.userId)
  )
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('password').isString(),
  validate,
  ch(({ server, body }) => systemService.storeSystemUser(server, body))
)

router.put(
  '/:userId/password',
  auth.required,
  body('password').isLength({ min: 8 }).trim().escape(),
  validate,
  ch(({ server, body, params }) =>
    systemService.changeSystemUserPassword(server, params.userId, body.password)
  )
)

router.delete(
  '/:userId',
  auth.required,
  ch(({ server, params }) =>
    systemService.deleteSystemUser(server, params.userId)
  )
)

export default router
