import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as serverService from 'services/server.service'
import * as systemService from 'services/system.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => server)
)

router.get(
  '/summary',
  auth.required,
  ch(({ server }) => serverService.getSummary(server))
)

router.get(
  '/phpVersion',
  auth.required,
  ch(({ server }) => systemService.getPhpVersion(server))
)

router.put(
  '/phpVersion',
  auth.required,
  body('phpVersion').notEmpty(),
  validate,
  ch(({ server, body }) =>
    systemService.updatePhpVersion(server, body.phpVersion)
  )
)

router.delete(
  '/',
  auth.required,
  ch(({ server }) => serverService.deleteServer(server))
)

export default router
