import { model } from 'mongoose'
import { Server, SystemUser, SSHKey } from 'models'
import { createServerActivityLogInfo } from 'services/activity.service'
import * as activitySvc from 'services/activity.service'
import * as agentSvc from './agent.service'
import { php_versions } from './constants'
const SystemUserModel = model<SystemUser>('SystemUser')
const SSHKeyModel = model<SSHKey>('SSHKey')

export async function getSystemUsers(server: Server) {
  const users = await SystemUserModel.find({ server: server.id })
  return {
    success: true,
    data: { users: users.map((it) => it.getJson()) },
  }
}

export async function getSystemUserById(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
  return {
    success: true,
    data: { user: user },
  }
}

export async function createSystemUser(server: Server, data: any) {}

export async function storeSystemUser(server: Server, data: any) {
  const exists = await SystemUserModel.findOne({
    server: server.id,
    name: data.name,
  })
  if (exists) {
    throw new Error('Name has already been taken.')
  }

  const res = await agentSvc.createSystemUser(server.address, data)
  if (res.error != 0) {
    if (res.error == 9) {
      throw new Error('System user has already been taken.')
    }
    throw new Error(`Agent error ${res.error}`)
  }

  const user = new SystemUserModel(data)
  user.server = server
  await user.save()

  const message = `Added new system user ${user.name} with password`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { user: user },
  }
}

export async function deleteSystemUser(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
  if (!user) {
    throw new Error(`System user doesn't exists`)
  }

  const res = await agentSvc.deleteSystemUser(server.address, user.name)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  await user.remove()

  const message = `Deleted system user ${user.name}`
  await createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: userId },
  }
}

export async function changeSystemUserPassword(
  server: Server,
  userId: string,
  password: string
) {
  const user = await SystemUserModel.findById(userId)
  if (!user) {
    throw new Error(`The user doesn't exist`)
  }

  const res = await agentSvc.changeSystemUserPassword(
    server.address,
    user.name,
    password
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  user.password = password
  await user.save()

  const message = `Changed password for system user ${user.name}`
  await createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: userId },
  }
}

export async function getServerSSHKeys(server: Server) {
  const sshKeys = await SSHKeyModel.find({ server: server.id }).populate('user')

  return {
    success: true,
    data: {
      sshKeys: sshKeys.map((it) => {
        const item = {
          id: it.id,
          userId: it.user?._id,
          userName: it.user?.name,
          label: it.label,
          publicKey: it.publicKey,
        }
        return item
      }),
    },
  }
}

export async function createServerSSHKey(server: Server) {
  const systemUsers = await SystemUserModel.find({
    server: server.id,
  })
  return {
    success: true,
    data: {
      systemusers: systemUsers.map((it) => it.getJson()),
    },
  }
}

export async function storeServerSSHKey(
  server: Server,
  data: { label: string; userId: string; publicKey: string }
) {
  const exists = await SSHKeyModel.find({
    server: server.id,
    label: data.label,
  })
  if (exists && exists.length > 0) {
    throw new Error('Label has already been taken.')
  }

  const systemUser = await SystemUserModel.findById(data.userId)
  if (!systemUser) {
    throw new Error(`System user doesn't exists`)
  }

  const res = await agentSvc.createSSHKey(
    server.address,
    systemUser.name,
    data.publicKey
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const sshkey = new SSHKeyModel(data)
  sshkey.server = server.id
  sshkey.user = systemUser
  await sshkey.save()

  const message = `Added new SSH key ${data.label} with user ${data.userId}`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { sshkey: sshkey },
  }
}

export async function deleteServerSSHKey(server: Server, keyId: string) {
  const sshKey = await SSHKeyModel.findById(keyId).populate('user')
  if (!sshKey) {
    throw Error("It doesn't exists")
  }

  const res = await agentSvc.deleteSSHKey(
    server.address,
    sshKey.user.name,
    sshKey.publicKey
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  await sshKey.remove()

  const message = `Deleted SSH Key ${sshKey.label}`
  await activitySvc.createServerActivityLogInfo(server, message, 1)

  return {
    success: true,
    data: { id: keyId },
  }
}

export async function getDeploymentKeys(server: Server) {
  const users = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      keys: users.map((it) => it.toDeploymentKeyJson()),
    },
  }
}

export async function storeDeploymentKey(server: Server, userId: string) {
  const user = await SystemUserModel.findById(userId)
  if (!user) {
    throw Error(`System user doesn't exists`)
  }

  const res = await agentSvc.createDeploymentKey(server.address, user.name)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  user.deploymentKey = res.pubKey
  await user.save()

  const message = `Created new deployment key for system user ${user.name}`
  await createServerActivityLogInfo(server.id, message)

  return {
    success: true,
    data: { key: res.pubKey },
  }
}

export async function getPhpVersion(server: Server) {
  return {
    success: true,
    data: {
      avaliable: php_versions,
      phpVersion: server.phpVersion,
    },
  }
}

export async function updatePhpVersion(server: Server, version: string) {
  server.phpVersion = version
  await server.save()

  return {
    success: true,
    data: {
      id: server._id,
      phpVersion: version,
    },
  }
}

export async function getSystemServices(server: Server) {
  //const services = await Service.find({ serverId: server.id });
  const services = [
    {
      symbol: 'media/svg/misc/015-telegram.svg',
      service: 'Beanstalk',
      version: '1.11-1',
      processor_usage: '40%',
      memory_usage: '80MB',
      status: true,
      action: '',
    },
    {
      symbol: 'media/svg/misc/006-plurk.svg',
      service: 'Httpd/Apache',
      version: '2.4-3.3',
      processor_usage: '-',
      memory_usage: '-',
      status: false,
      action: 'ReactJs, HTML',
    },
    {
      symbol: 'media/svg/misc/003-puzzle.svg',
      service: 'MariaDB',
      version: '1.456-maria-focal',
      processor_usage: '-',
      memory_usage: '-',
      status: true,
      action: 'Laravel, Metronic',
    },
    {
      symbol: 'media/svg/misc/005-bebo.svg',
      service: 'Memcached',
      version: '1.525-2ubuntu0.1',
      processor_usage: '45%',
      memory_usage: '8GB',
      status: false,
      action: 'AngularJS, C#',
    },
  ]
  console.log('getSystemServices', services)
  return {
    success: true,
    data: { services },
  }
}

// export async function getVaultedSSHKeys(req: Request, res: Response) {
//   try {
//     const sshKeys = await SSHKey.find({ userId: req.payload.id })

//     res.json({
//       success: true,
//       data: {
//         sshKeys: sshKeys,
//         // sshKeys: sshKeys.map(it => it.name)
//       },
//     })
//   } catch (error) {
//     return res.status(501).json({
//       success: false,
//       errors: error,
//     })
//   }
// }

// export async function deleteVaultedSSHKey(req: Request, res: Response) {
//   try {
//     await SSHKey.deleteOne({
//       userId: req.payload.id,
//       id: req.params.keyId,
//     })

//     res.json({
//       success: true,
//       message: 'SSH Key has been successfully deleted.',
//     })
//   } catch (error) {
//     return res.status(501).json({
//       success: false,
//       errors: error,
//     })
//   }
// }
