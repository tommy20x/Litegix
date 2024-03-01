// import { body } from 'express-validator'
import { Router } from 'express'
// import auth from '../auth'
// import * as securities from 'services/security.service'
const router = Router()

// get firewalls list
// request : /servers/{serverId}/security/firewalls
// RESPONSE : json data
// router.get('/firewalls', auth.required, securities.getData)

// get firewalls by id
// REQUEST : /servers/{serverId}/security/firewalls/{firewallId}
// RESPONSE :   "id": firewallId,
//              "type": "rich",
//              "port": "9000",
//              "protocol": "tcp",
//              "ipAddress": "192.168.43.0\/24",
//              "firewallAction": "accept",
//              "created_at": "2019-06-27 10:15:07"
// router.put('/firewalls/:firewallId', auth.required, securities.getByIdData)

// deploy Rule
// REQUEST : /servers/{serverId}/security/firewalls
// RESPONSE : null
// router.put('/firewalls', auth.required, securities.deployRule)

// delete Rule
// REQUEST : /servers/{serverId}/security/firewalls/{firewallId}
// RESPONSE :   "id": firewallId,
//              "type": "rich",
//              "port": "9000",
//              "protocol": "tcp",
//              "ipAddress": "192.168.43.0\/24",
//              "firewallAction": "accept",
//              "created_at": "2019-06-27 10:15:07"
// router.delete('/firewalls/:firewallId', auth.required, securities.deleteRule)

// create firewalls rule
//  REQUEST : /servers/{serverId}/security/firewalls
// router.post(
//   '/firewalls',
//   auth.required,
//   body('sec_type').notEmpty(),
//   body('port').isString().notEmpty(),
//   body('protocol').notEmpty(),
//   body('ip_address').notEmpty(),
//   body('action').notEmpty(),
//   securities.firewalls
// )

export default router
