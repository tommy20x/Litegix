import { body } from 'express-validator'
import { Router, Request, Response } from 'express'
import auth from '../auth'
import validate from '../validate'
import * as profile from 'services/profile.service'
const router = Router()

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const userId = req.payload.id
    const response = await profile.getProfile(userId)
    res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }
})

// Upate user profile
router.post(
  '/',
  auth.required,
  body('email').isEmail(),
  body('name').isLength({ min: 3, max: 20 }).trim().escape(),
  body('timezone').isString(),
  body('loginNotification').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await profile.updateProfile(userId, req.body)
      res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

// Update company info
router.post(
  '/company',
  auth.required,
  body('name').isLength({ min: 3, max: 100 }).trim().escape(), //.isFQDN()
  body('address1').notEmpty(),
  body('address2').notEmpty(),
  body('city').notEmpty(),
  body('postal').isNumeric(),
  body('state').notEmpty(),
  body('country').notEmpty(),
  body('tax').isNumeric(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const userId = req.payload.id
      const response = await profile.updateCompany(userId, req.body)
      res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

export default router
