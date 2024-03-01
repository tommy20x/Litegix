import { body } from 'express-validator'
import { model } from 'mongoose'
import { Router, Request, Response } from 'express'
import { Channel } from 'models/channel.model'
import auth from 'routes/auth'
import validate from 'routes/validate'
import errorMessage from 'routes/errors'
import * as notifySvc from 'services/notification.service'
const ChannelModel = model<Channel>('Channel')
const router = Router()

// Preload channel on routes with ':channelId'
router.param('channelId', function (req, res, next, channelId: string) {
  ChannelModel.findById(channelId)
    .then(function (channel) {
      if (!channel) {
        return res.sendStatus(404)
      }
      req.channel = channel
      return next()
    })
    .catch(next)
})

router.get('/', auth.required, async function (req: Request, res: Response) {
  try {
    const response = await notifySvc.getNotifications(req.payload.id)
    return res.json(response)
  } catch (e) {
    console.error(e)
    return res.status(501).json({
      success: false,
      errors: errorMessage(e),
    })
  }
})

router.post(
  '/newsletters/subscribe',
  auth.required,
  body('subscription').isBoolean(),
  body('announchment').isBoolean(),
  body('blog').isBoolean(),
  body('events').isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.subscribe(req.payload.id, req.body)
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
  '/newsletters/unsubscribe',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.unsubscribe(req.payload.id)
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
  '/channels',
  auth.required,
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.getChannels(req.payload.id)
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
  '/channels',
  auth.required,
  body('service').isString(),
  body('name').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.storeChannel(req.payload.id, req.body)
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
  '/channels/:channelId',
  auth.required,
  body('service').isString(),
  body('name').isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.updateChannel(req.channel, req.body)
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

router.delete(
  '/channels/:channelId',
  auth.required,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.deleteChannel(req.channel)
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
  '/channels/:channelId',
  auth.required,
  async function (req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        channel: req.channel,
      },
    })
  }
)

//TODO~~~~~~
router.post(
  '/channels/:channelId/healthsetting',
  auth.required,
  body('load').isNumeric().isInt({ min: 1, max: 255 }),
  body('memory').isNumeric().isInt({ min: 1, max: 99 }),
  validate,
  async function (req: Request, res: Response) {
    try {
      const response = await notifySvc.channelHealthSetting(
        req.channel,
        req.body
      )
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

export default router
