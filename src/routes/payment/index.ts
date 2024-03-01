import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as paymentSvc from 'services/payment.service'

const router = Router()

router.get(
  '/history',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const result = await paymentSvc.getPaymentHistory(req.payload.id)
      return res.json(result)
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.post(
  '/history',
  auth.required,
  body('type').isString(),
  body('number').isNumeric(),
  body('date').isDate(),
  body('invoice').isString(),
  body('receipt').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const result = await paymentSvc.storePaymentHistory(
        req.payload.id,
        req.body
      )
      return res.json(result)
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
