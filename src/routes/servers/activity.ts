import { Router } from 'express'
import { createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as activityService from 'services/activity.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => activityService.getServerActivityLogs(server))
)

export default router
