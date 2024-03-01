import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as accountSvc from 'services/account.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const userId = req.payload.id
    const response = await accountSvc.getApiKeys(userId)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

router.put(
  '/apiKey',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await accountSvc.createApiKey(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.put(
  '/secretKey',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await accountSvc.createSecretKey(userId)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.post(
  '/enableaccess',
  auth.required,
  body('state').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await accountSvc.enableAccess(userId, req.body)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.get(
  '/ipaddr',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await accountSvc.getAllowedIPAddresses(req.payload.id)
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

router.post(
  '/ipaddr',
  auth.required,
  body('address').isIP(4),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await accountSvc.addAllowedIPAddress(
        req.payload.id,
        req.body
      )
      return res.json(response)
    } catch (e) {
      return res.status(501).json({
        success: false,
        errors: errorMessage(e),
      })
    }
  }
)

export default router
