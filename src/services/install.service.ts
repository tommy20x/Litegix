import path from 'path'
import fs from 'fs'
import util from 'util'
import { model } from 'mongoose'
import { Server } from 'models'
import config from './config.service'
import crypto from './crypto.service'
const ServerModel = model<Server>('Server')
const readFile = util.promisify(fs.readFile)

const encryptToken = (payload: any) => {
  const encrypted = crypto.encrypt(JSON.stringify(payload))
  return encrypted.split('/').join('@')
}

const decryptToken = function (token: string) {
  const encrypted = token.split('@').join('/')
  const decrypted = crypto.decrypt(encrypted)
  return JSON.parse(decrypted)
}

export async function getBashScript(userId: string, server: Server) {
  const payload = {
    userId,
    serverId: server.id,
  }
  const token = encryptToken(payload)
  return {
    success: true,
    data: {
      name: server.name,
      loginScript: 'ssh root@' + server.address,
      installScript: config.install_script(token),
    },
  }
}

export async function getAgentInstallScript(encryptedToken: string) {
  const token = decryptToken(encryptedToken)
  console.log('InstallScript, Token:', token)

  const server = await ServerModel.findById(token.serverId)
  if (!server) {
    throw Error('Invalid Token')
  }

  const filePath = path.join(__dirname, '../../scripts/install.sh')
  const text = await readFile(filePath, 'utf8')
  return text
    .replace('LITEGIX_TOKEN=""', `LITEGIX_TOKEN=\"${encryptedToken}\"`)
    .replace('LITEGIX_URL=""', `LITEGIX_URL=\"${process.env.SERVER_URL}\"`)
    .replace('SERVERID=""', `SERVERID=\"${server.securityId}\"`)
    .replace('SERVERKEY=""', `SERVERKEY=\"${server.securityKey}\"`)
    .replace('WEBSERVER=""', `WEBSERVER=\"${server.webserver}\"`)
    .replace('DATABASE=""', `DATABASE=\"${server.database}\"`)
    .replace('PHP_CLI_VERSION=""', `PHP_CLI_VERSION=\"${server.phpVersion}\"`)
}

export async function getInstallState(server: Server) {
  return {
    success: true,
    data: {
      state: 'Install',
      percent: 20,
    },
  }
}

export async function updateInstallState(encryptedToken: string, data: any) {
  const { serverId } = decryptToken(encryptedToken)
  console.log('updateInstallState, Token:', serverId, data)

  const server = await ServerModel.findById(serverId)
  if (!server) {
    return {
      success: false,
      errors: { message: 'invalid_server_id' },
    }
  }
  console.log('updateInstallState, found server')

  let progress = server.installation?.progress || 0
  let message = data.message
  switch (data.status) {
    case 'start':
      progress = 5
      message =
        'Starting installation. Upgrading system to latest update. This will take a while...'
      break
    case 'port':
      progress = 10
      message = 'Checking open port...'
      break
    case 'config':
      progress = 20
      message = 'Bootstrap server...'
      break
    case 'update':
      progress = 30
      message = 'Upgrating system to latest software version...'
      break
    case 'packages':
      progress = 35
      message =
        'Installation started. Installing dependency will take a few minutes...'
      break
    case 'supervisor':
      progress = 40
      message = 'Configuring Supervisord to run background job...'
      break
    case 'fail2ban':
      progress = 45
      message = 'Configuring Supervisord to run background job...'
      break
    case 'nginx':
    case 'openlitespeed':
      progress = 50
      message = 'Installing webserver. It will take a few minutes...'
      break
    case 'mariadb':
    case 'mysql':
      progress = 75
      message = 'Configuring MariaDB database...'
      break
    case 'finish':
      server.connected = true
      progress = 100
      message = 'Server has been installed successufuly'
      break
  }

  server.installation = {
    status: data.status,
    message: message,
    progress: progress,
  }
  await server.save()

  return {
    success: true,
  }
}

export async function getInstallStatus(server: Server) {
  return {
    success: true,
    data: {
      ...server.installation,
    },
  }
}
