import { Router } from 'express'
import auth from '../auth'
import * as server from 'services/server.service'
const router = Router()

router.get('/', auth.required, server.getServers)

export default router
