import { Router } from 'express'
import { createHandler as ch } from 'routes/helper'
import auth from 'routes/auth'
import * as installSvc from 'services/install.service'
const router = Router()

router.get(
  '/bashscript',
  auth.required,
  ch(({ server, payload }) => installSvc.getBashScript(payload.id, server))
)

router.get(
  '/installstatus',
  auth.required,
  ch(({ server }) => installSvc.getInstallStatus(server))
)

export default router
