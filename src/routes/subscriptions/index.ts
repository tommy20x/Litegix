// import { body } from 'express-validator'
import { Router } from 'express'
// import { validate, createHandler as ch } from 'routes/helper'
// import auth from '../auth'
// import * as subscription from 'services/subscription.service'
const router = Router()

// router.post('/', auth.required, subscription.getCurrentServerPlan)

// router.post('/create', auth.required, subscription.createSubscription)

// router.get('/credittopup', subscription.getCredittopup)
// router.get('/serverplans', subscription.getServerPlans)
// router.get('/backupplans', subscription.getBackupPlans)
// router.post('/insertbalance', auth.required, subscription.insertUserBalance)
// router.post('/active', auth.required, subscription.active)
// router.post('/inactive', auth.required, subscription.inactive)
// router.post('/canceled', auth.required, subscription.canceled)

// router.get(
//   '/',
//   auth.required,
//   ch(({ server }) => subscription.getDatabases(server))
// )

// router.get(
//   '/search',
//   auth.required,
//   ch(({ server, query }) =>
//     database.searchDatabase(server, query.name as string)
//   )
// )

// router.get(
//   '/create',
//   auth.required,
//   ch(({ server }) => subscription.createDatabase(server))
// )

// router.post(
//   '/',
//   auth.required,
//   body('name').isString(),
//   body('userId').isString(),
//   validate,
//   ch(({ server, body }) => database.storeDatabase(server, body))
// )

export default router
