import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as planService from 'services/plan.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(() => planService.getPlans())
)

router.post(
  '/',
  auth.required,
  body('name').isString().isLength({ min: 2, max: 100 }),
  body('price').isNumeric(),
  validate,
  ch(({ body }) => planService.createPlan(body.name, body.price))
)

router.delete(
  '/:planId',
  auth.required,
  ch(({ params }) => planService.deletePlan(params.planId))
)

export default router
