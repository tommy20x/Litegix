import { Router } from 'express'
import profile from './profile'
import account from './account'
import apiKeys from './apiKeys'
import notifications from './notifications'
import ipwhitelist from './ipwhitelist'
import activity from './activity'
import paymentmethods from './paymentmethods'

const router = Router()
router.use('/profile', profile)
router.use('/account', account)
router.use('/apikey', apiKeys)
router.use('/notifications', notifications)
router.use('/ipwhitelist', ipwhitelist)
router.use('/activity', activity)
router.use('/payment', paymentmethods)

export default router
