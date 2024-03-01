import { Router } from 'express'
import users from './users'
import installation from './installation'
import agent from './agent'
import explorer from './explorer'

const router = Router()
router.use('/', users)
router.use('/installation', installation)
router.use('/agent', agent)
router.use('/explorer', explorer)

export default router
