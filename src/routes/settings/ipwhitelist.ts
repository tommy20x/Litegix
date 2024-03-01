import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as ipwhitelist from 'services/ipwhitelist.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const result = await ipwhitelist.getWhiteList(req.payload.id)
    return res.json(result)
  } catch (e) {
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

router.post(
  '/',
  auth.required,
  body('ipaddr').isIP(4),
  validate,
  async function (req: Request, res: Response) {
    try {
      const result = await ipwhitelist.storeIPAddress(
        req.payload.id,
        req.body.ipaddr
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

router.delete(
  '/:addrId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const result = await ipwhitelist.deleteIp(
        req.payload.id,
        req.params.addrId
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

router.post(
  '/ipwhitelisting',
  auth.required,
  body('state').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const result = await ipwhitelist.setIPWhitelistingState(
        req.payload.id,
        req.body.state
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
