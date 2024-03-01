import { Router } from 'express'
import { body } from 'express-validator'
import { validate, createHandler as ch } from 'routes/helper'
import auth from 'routes/auth'
import * as payment from 'services/payment.service'
const router = Router()

router.get(
  '/methods',
  auth.required,
  ch(({ payload }) => payment.getPaymentMethods(payload.id))
)

router.post(
  '/methods',
  auth.required,
  body('name').isString(),
  body('country').isString(),
  body('postcode').isString(),
  body('cardNumber').isString(),
  body('expire').isString(),
  body('cvc').isString(),
  validate,
  ch(({ payload, body }) => payment.storePaymentMethods(payload.id, body))
)

export default router
