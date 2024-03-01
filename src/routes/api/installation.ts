import { Router } from 'express'
import {
  createHandler as ch,
  createHandlerAndSendText as chs,
} from 'routes/helper'
import * as install from 'services/install.service'

const router = Router()
router.get(
  '/script/:token',
  chs(({ params }) => install.getAgentInstallScript(params.token))
)

router.post(
  '/status/:token',
  ch(({ body, params }) => install.updateInstallState(params.token, body))
)

export default router
