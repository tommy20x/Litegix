import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from '../auth'
import validate from 'routes/validate'
import * as authService from 'services/auth.service'
const router = Router()

// Upate user profile
router.post(
  '/password',
  auth.required,
  body('current_password').isString(),
  body('password').isString().isLength({ min: 8 }),
  validate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.payload.id
      const { current_password, password } = req.body
      const response = await authService.changePassword(
        userId,
        current_password,
        password
      )
      return res.json(response)
    } catch (e) {
      console.error(e)
      return res.status(501).json({ success: false })
    }
  }
)

//TODO
// router.delete('/', auth.required, authService.deleteAccount)

export default router
