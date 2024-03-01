import { body, query } from 'express-validator'
import { Router, Request, Response, NextFunction } from 'express'
import { model } from 'mongoose'
import { Server } from 'models/server.model'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as serverSvc from 'services/server.service'
const Server = model<Server>('Server')
const router = Router()

// Preload server on routes with ':serverId'
router.param(
  'serverId',
  function (req: Request, res: Response, next: NextFunction, serverId: string) {
    Server.findById(serverId)
      .then(function (server) {
        if (!server) {
          return res.sendStatus(404)
        }
        req.server = server
        return next()
      })
      .catch(next)
  }
)

router.get(
  '/',
  auth.required,
  query('page').isNumeric(),
  query('size').isNumeric(),
  validate,
  ch(({ query }) =>
    serverSvc.getPageServers(Number(query.page), Number(query.size))
  )
)

router.get(
  '/new',
  auth.required,
  ch(() => serverSvc.createServer())
)

router.get(
  '/:serverId',
  auth.required,
  ch(({ params }) => serverSvc.getServerById(params.serverId))
)

router.post(
  '/',
  auth.required,
  body('name').notEmpty(),
  body('address').isIP(4),
  body('webserver').notEmpty(),
  body('database').notEmpty(),
  body('phpVersion').notEmpty(),
  validate,
  ch(({ payload, body }) => serverSvc.storeServer(payload.id, body))
)

router.delete(
  '/:serverId',
  auth.required,
  ch(({ server }) => serverSvc.deleteServer(server))
)

export default router
