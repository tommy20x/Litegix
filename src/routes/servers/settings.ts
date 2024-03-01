import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as serverSvc from 'services/server.service'
const router = Router()

// router.get("/", auth.required, server.getServers)

router.get('/', auth.required, async function (req: Request, res: Response) {
  const server = req.server
  return res.json({
    success: true,
    data: {
      name: server.name,
      provider: server.provider,
      address: server.address,
    },
  })
})

router.put(
  '/details',
  auth.required,
  body('name').notEmpty(),
  body('provider').notEmpty(),
  validate,
  ch(({ server, body, payload }) =>
    serverSvc.updateServerName(payload.id, server, body.name, body.provider)
  )
)

router.put(
  '/address',
  auth.required,
  body('address').isIP(4),
  validate,
  ch(({ server, body, payload }) =>
    serverSvc.updateServerAddress(payload.id, server, body.address)
  )
)

export default router
