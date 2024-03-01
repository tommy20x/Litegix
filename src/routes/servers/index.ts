import { Router, Request, Response, NextFunction } from 'express'
import { model } from 'mongoose'
import { Server } from 'models/server.model'
import servers from './servers'
import installation from './installation'
import webapps from './webapps'
import databases from './databases'
import systemusers from './systemusers'
import credentials from './credentials'
import deployKey from './deployKey'
import cronJobs from './cronJobs'
import supervisors from './supervisors'
import notifications from './notifications'
import services from './services'
import securities from './securities'
import settings from './settings'
import activity from './activity'
import server from './server'
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

router.use('/', servers)
router.use('/:serverId/installation', installation)
router.use('/:serverId/webapps', webapps)
router.use('/:serverId/databases', databases)
router.use('/:serverId/systemusers', systemusers)
router.use('/:serverId/sshcredentials', credentials)
router.use('/:serverId/deploykeys', deployKey)
router.use('/:serverId/cronjobs', cronJobs)
router.use('/:serverId/supervisors', supervisors)
router.use('/:serverId/notifications', notifications)
router.use('/:serverId/services', services)
router.use('/:serverId/securities', securities)
router.use('/:serverId/settings', settings)
router.use('/:serverId/activities', activity)
router.use('/:serverId', server)

export default router
