import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as systemService from 'services/system.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => systemService.getServerSSHKeys(server))
)

//router.get('/vault', auth.required, systemService.getVaultedSSHKeys)

router.get(
  '/create',
  auth.required,
  ch(({ server }) => systemService.createServerSSHKey(server))
)

router.post(
  '/',
  auth.required,
  body('label').notEmpty(),
  body('userId').notEmpty(),
  body('publicKey').notEmpty(),
  validate,
  ch(({ server, body }) => systemService.storeServerSSHKey(server, body))
)

router.delete(
  '/:keyId',
  auth.required,
  ch(({ server, params }) =>
    systemService.deleteServerSSHKey(server, params.keyId)
  )
)

export default router
