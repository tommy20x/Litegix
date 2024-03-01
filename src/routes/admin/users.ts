import { body, query } from 'express-validator'
import { Router } from 'express'
import { validate, createHandler as ch } from 'routes/helper'
import auth from '../auth'
import * as userService from 'services/user.service'
const router = Router()

router.get(
  '/',
  auth.required,
  query('page').isNumeric(),
  query('size').isNumeric(),
  validate,
  ch(({ query }) =>
    userService.getUsers(Number(query.page), Number(query.size))
  )
)

router.get(
  '/new',
  auth.required,
  ch(() => userService.newUser())
)

router.get(
  '/:userId',
  auth.required,
  ch(({ params }) => userService.getUserInfo(params.userId))
)

router.post(
  '/',
  auth.required,
  body('email').isEmail(),
  body('username').isString().isLength({ min: 4, max: 260 }),
  body('password').isString().isLength({ min: 8, max: 260 }),
  validate,
  ch(({ body }) => userService.createUser(body))
)

router.put(
  '/:userId',
  auth.required,
  body('email').isEmail(),
  body('username').isString().isLength({ min: 4, max: 260 }),
  body('password').isString().isLength({ min: 8, max: 260 }),
  validate,
  ch(({ params, body }) => userService.updateUser(params.userId, body))
)

router.delete(
  '/:userId',
  auth.required,
  ch(({ params }) => userService.deleteUser(params.userId))
)

export default router
