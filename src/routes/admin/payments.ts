import { query } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as paymentService from 'services/payment.service'
const router = Router()

router.get(
  '/',
  auth.required,
  query('page').isNumeric(),
  query('size').isNumeric(),
  validate,
  ch(({ query }) =>
    paymentService.getAllPaymentHistory(Number(query.page), Number(query.size))
  )
)

router.get(
  '/:paymentId',
  auth.required,
  ch(({ params }) => paymentService.getPaymentHistoryById(params.paymentId))
)

router.get(
  '/filter/:userId',
  auth.required,
  ch(({ query, params }) =>
    paymentService.getPageablePaymentHistory(
      params.userId,
      Number(query.page),
      Number(query.size)
    )
  )
)

router.delete(
  '/:paymentId',
  auth.required,
  ch(({ params }) => paymentService.deleteHistory(params.paymentId))
)

export default router
