import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as backupSvc from 'services/backup.service'

const router = Router()

router.post(
  '/store',
  auth.required,
  body('name').isString(),
  body('backupableWebapp').isString(),
  body('backupableDb').isString(),
  body('storage').isString(),
  body('retention').isString(),
  body('time').isString(),
  body('type').isString(),
  body('successNotification').isBoolean(),
  body('failNotification').isBoolean(),
  body('backupFileFormat').isString(),
  body('instanceType').isString(),
  body('backupType').isString(),
  body('startTime').isString(),
  body('backupStartTime').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const result = await backupSvc.backup(
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