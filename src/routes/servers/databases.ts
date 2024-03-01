import { body } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as database from 'services/database.service'
const router = Router()

router.get(
  '/',
  auth.required,
  ch(({ server }) => database.getDatabases(server))
)

router.get(
  '/search',
  auth.required,
  ch(({ server, query }) =>
    database.searchDatabase(server, query.name as string)
  )
)

router.get(
  '/create',
  auth.required,
  ch(({ server }) => database.createDatabase(server))
)

router.post(
  '/',
  auth.required,
  body('name').isString(),
  body('userId').isString(),
  validate,
  ch(({ server, body }) => database.storeDatabase(server, body))
)

router.delete(
  '/:databaseId',
  auth.required,
  ch(({ server, params }) => database.deleteDatabase(server, params.databaseId))
)

// router.get('/:databaseId/grant', auth.required, database.getUngrantedDBuser)

router.post(
  '/:databaseId/grant',
  auth.required,
  body('dbuserId').isString(),
  validate,
  ch(({ server, body, params }) =>
    database.grantDatabaseUser(server, params.databaseId, body.dbuserId)
  )
)

router.delete(
  '/:databaseId/grant/:dbuserId',
  auth.required,
  ch(({ server, params }) =>
    database.revokeDatabaseUser(server, params.databaseId, params.dbuserId)
  )
)

router.get(
  '/:databaseId/users/ungranted',
  auth.required,
  ch(({ server, params }) =>
    database.getUngrantedDBUsers(server, params.databaseId)
  )
)

router.get(
  '/users',
  auth.required,
  ch(({ server }) => database.getDatabaseUserList(server))
)

router.get(
  '/users/:dbuserId',
  auth.required,
  ch(({ params }) => database.getDatabaseUser(params.dbuserId))
)

router.get(
  '/users/search',
  auth.required,
  ch(({ server, query }) =>
    database.searchDatabaseUser(server, query.name as string)
  )
)

router.post(
  '/users',
  auth.required,
  body('name').isString(),
  body('password').isString(),
  validate,
  ch(({ server, body }) => database.storeDatabaseUser(server, body))
)

router.put(
  '/users/:dbuserId/password',
  auth.required,
  body('password').isString(),
  validate,
  ch(({ server, body, params }) =>
    database.changePassword(server, params.dbuserId, body.password)
  )
)

router.delete(
  '/users/:userId',
  auth.required,
  ch(({ server, params }) => database.deleteDatabaseUser(server, params.userId))
)

export default router
