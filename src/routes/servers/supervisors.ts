import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as cronjob from 'services/cron.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => cronjob.getSupervisorJobs(server))
)

router.get(
  '/create',
  auth.required,
  ch(({ server }) => cronjob.createSupervisorJob(server))
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('user').isString(),
  body('numprocs').isNumeric(),
  body('vendorBinary').isString(),
  body('command').isString(),
  body('autoStart').isBoolean(),
  body('autoRestart').isBoolean(),
  validate,
  ch(({ server, body }) => cronjob.storeSupervisorJob(server, body))
)

router.delete(
  '/:jobId',
  auth.required,
  ch(({ server, params }) => cronjob.deleteSupervisorJob(server, params.jobId))
)

export default router
