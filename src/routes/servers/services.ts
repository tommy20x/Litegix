import { Router } from 'express'
import { createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as system from 'services/system.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => system.getSystemServices(server))
)

export default router
