import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as cronJob from 'services/cron.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => cronJob.getCronJobs(server))
)

router.get(
  '/create',
  auth.required,
  ch(({ server }) => cronJob.createCronJob(server))
)

router.post(
  '/',
  auth.required,
  body('label').notEmpty(),
  body('user').notEmpty(),
  body('command').notEmpty(),
  body('vendor_binary').notEmpty(),
  body('predef_setting').notEmpty(),
  validate,
  ch(({ server, body }) => cronJob.storeCronJob(server, body))
)

router.get(
  '/:jobId',
  auth.required,
  ch(({ params }) => cronJob.getCronJob(params.jobId))
)

router.delete(
  '/:jobId',
  auth.required,
  ch(({ server, params }) => cronJob.removeCronJob(server, params.jobId))
)

export default router
