import { Router, Request, Response } from 'express'
import auth from 'routes/auth'
import errorMessage from 'routes/errors'
import * as activity from 'services/activity.service'
const router = Router()

//TODO ~~~~~~~~~~~ pagge
router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await activity.getAccountActivityLogs(req.payload.id)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

export default router
