import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { model } from 'mongoose'
import {
  Server,
  Webapp,
  WebappRequest,
  SystemUser,
  Domain,
  Firewall,
} from 'models'
import * as activitySvc from 'services/activity.service'
import * as agentSvc from 'services/agent.service'
import {
  php_versions,
  web_application_stacks,
  web_environments,
  web_ssl_methods,
} from './constants'
const WebappModel = model<Webapp>('Webapp')
const DomainModel = model<Domain>('Domain')
const SystemUserModel = model<SystemUser>('SystemUser')

const getDomainSuffix = function () {
  return `kc${randomBytes(12).toString('hex')}`
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export async function getWebApplications(server: Server) {
  const apps = await WebappModel.find({ server }).populate('owner')
  return {
    success: true,
    data: {
      apps: apps.map((it) => {
        return {
          ...it.toJSON(),
          owner: it.owner.name,
        }
      }),
    },
  }
}

export async function findWebappById(id: string) {
  const webapp = await WebappModel.findById(id)
  return {
    success: true,
    data: { webapp },
  }
}

export async function getWebapp(webapp: Webapp) {
  return new Promise((resolve) => {
    resolve({
      success: true,
      data: { webapp },
    })
  })
}

/**
 */
export async function createCustomWebApplication(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_environments: web_environments,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
    },
  }
}

/**
 */
export async function storeCustomWebApplication(
  server: Server,
  data: WebappRequest
) {
  const exists = await WebappModel.findOne({
    server: server,
    name: data.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  let systemUser: SystemUser | null = null
  if (data.isUserExists) {
    systemUser = await SystemUserModel.findById(data.owner)
    if (!systemUser) {
      throw new Error('The user doen not exists.')
    }
  } else {
    systemUser = await SystemUserModel.findOne({ name: data.owner })
    if (!systemUser) {
      systemUser = new SystemUserModel({
        name: data.owner,
        password: 'litegix',
      })
      systemUser.server = server
      await systemUser.save()
    }
  }

  /*const res = await agentSvc.createWordpress(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }*/

  const domainModel = new DomainModel(data.domain)
  const domain = await domainModel.save()

  const webapp = new WebappModel({
    ...data,
    domains: [domain],
    appType: 'custom',
    sslMethod: 'basic',
    server: server,
    owner: systemUser,
  })
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${data.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}

/**
 */
export async function createWordpressApplication(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
      canvases: [],
    },
  }
}

/**
 */
export async function storeWordpressApplication(
  server: Server,
  data: WebappRequest
) {
  const exists = await WebappModel.findOne({
    server: server,
    name: data.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  let systemUser: SystemUser | null = null
  if (data.isUserExists) {
    systemUser = await SystemUserModel.findById(data.owner)
    if (!systemUser) {
      throw new Error('The user doen not exists.')
    }
  } else {
    systemUser = await SystemUserModel.findOne({ name: data.owner })
    if (!systemUser) {
      systemUser = new SystemUserModel({
        name: data.owner,
        password: 'litegix',
      })
      systemUser.server = server
      await systemUser.save()
    }
  }

  const rand = function () {
    return 1000000 + getRandomInt(1000000)
  }

  const wp = data.wordpress
  const wordpress = {
    ...wp,
    databaseName: wp.databaseName || `${data.name}_${rand()}`,
    databasePass: wp.databasePass || `Litegix_${uuidv4().replace(/-/g, '')}`,
    databaseUser: wp.databaseUser || `${data.name}_${rand()}`,
    siteTitle: wp.siteTitle || `${data.name}_${rand()}`,
  }
  const postData = {
    name: data.name,
    domainName: data.domain.name,
    userName: systemUser?.name,
    phpVersion: data.phpVersion,
    webserver: server.webserver,
    ...wordpress,
  }
  const res = await agentSvc.createWordpress(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const domainModel = new DomainModel(data.domain)
  const domain = await domainModel.save()

  const webapp = new WebappModel({
    ...data,
    domains: [domain],
    appType: 'wordpress',
    sslMethod: 'basic',
    server: server,
    owner: systemUser,
  })
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${data.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}

/**
 */
export async function createPhpMyAdmin(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
    },
  }
}

/**
 */
export async function storePhpMyAdmin(server: Server, data: WebappRequest) {
  const exists = await WebappModel.findOne({
    server: server,
    name: data.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  let systemUser: SystemUser | null = null
  if (data.isUserExists) {
    systemUser = await SystemUserModel.findById(data.owner)
    if (!systemUser) {
      throw new Error('The user doen not exists.')
    }
  } else {
    systemUser = await SystemUserModel.findOne({ name: data.owner })
    if (!systemUser) {
      systemUser = new SystemUserModel({
        name: data.owner,
        password: 'litegix',
      })
      systemUser.server = server
      await systemUser.save()
    }
  }

  /*const res = await agentSvc.createWordpress(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }*/

  const domainModel = new DomainModel(data.domain)
  const domain = await domainModel.save()

  const webapp = new WebappModel({
    ...data,
    domains: [domain],
    appType: 'phpmyadmin',
    sslMethod: 'basic',
    server: server,
    owner: systemUser,
  })
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${data.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}

/**
 */
export async function storeGitRepository(
  server: Server,
  webapp: Webapp,
  payload: any
) {
  let githost = ''
  const provider = payload.provider
  if (provider == 'github') {
    githost = 'github.com'
  } else if (provider == 'gitlab') {
    githost = 'gitlab.com'
  } else if (provider == 'bitbucket') {
    githost = 'bitbucket.org'
  } else if (provider == 'custom') {
    if (!payload.githost) {
      throw new Error('Invalid Git Host.')
    }
    if (!payload.gituser) {
      throw new Error('Invalid Git User.')
    }
    githost = payload.githost
  }

  const url = `git@${githost}:${payload.repository}.git`
  const res = await agentSvc.createGitRepository(server.address, {
    url,
    branch: payload.branch,
  })
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  webapp.git = {
    provider: payload.provider,
    githost: githost,
    repository: payload.repository,
    branch: payload.branch,
  }
  await webapp.save()

  const message = `Added git repository to web application ${webapp.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { webappId: webapp._id },
  }
}

/**
 */
export async function getDomainById(webapp: Webapp, domainId: string) {
  const domain = await webapp.findDomain(domainId)

  return {
    success: true,
    data: { domain },
  }
}

/**
 */
export async function getDomains(webapp: Webapp) {
  webapp = await webapp.populate('domains').execPopulate()

  return {
    success: true,
    data: {
      domains: webapp.domains,
    },
  }
}

/**
 */
export async function addDomain(webapp: Webapp, data: Domain) {
  const exists = await webapp.findDomainByName(data.name)
  if (exists) {
    throw new Error('Name is already taken')
  }

  const domainModel = new DomainModel(data)
  domainModel.webapp = webapp
  const domain = await domainModel.save()

  webapp.domains.push(domain)
  await webapp.save()

  return {
    success: true,
    data: {
      id: domain.id,
    },
  }
}

/**
 */
export async function updateDomain(
  webapp: Webapp,
  domainId: string,
  payload: Domain
) {
  const domain = await webapp.findDomain(domainId)

  if (payload.type !== undefined) {
    domain.type = payload.type
  }
  if (payload.wwwEnabled !== undefined) {
    domain.wwwEnabled = payload.wwwEnabled
  }
  await domain.save()

  return {
    success: true,
    data: {
      id: domain.id,
    },
  }
}

/**
 */
export async function deleteDomain(webapp: Webapp, domainId: string) {
  const domain = await webapp.findDomain(domainId)

  const index = webapp.domains.indexOf(domain)
  if (index >= 0) {
    webapp.domains.splice(index, 1)
    await webapp.save()
  }

  await domain.delete()

  return {
    success: true,
    data: {
      id: domain.id,
    },
  }
}

export async function getSettings(webapp: Webapp) {
  return {
    success: true,
    data: {
      id: webapp.id,
      phpVersion: webapp.phpVersion,
      publicPath: webapp.publicPath,
      sslMethod: webapp.sslMethod,
      enableAutoSSL: webapp.enableAutoSSL,
      webAppStack: webapp.webAppStack,
      appType: webapp.appType,
      nginx: {},
      fpmSettings: {},
      phpSettings: {
        timezone: 'UTC',
      },
    },
  }
}

export async function updateWebappSettings(webapp: Webapp, updated: any) {
  webapp.phpVersion = updated.phpVersion
  webapp.publicPath = updated.publicPath
  webapp.sslMethod = updated.sslMethod
  webapp.webAppStack = updated.webAppStack
  //webapp.stackMode = updated.stackMode
  webapp.appType = updated.appType
  await webapp.save()

  return {
    success: true,
    data: {
      id: webapp.id,
    },
  }
}

export async function getFirewall(webapp: Webapp) {
  return {
    success: true,
    data: {
      firewall: webapp.firewall,
    },
  }
}

export async function updateFirewall(webapp: Webapp, data: Firewall) {
  webapp.firewall = data
  await webapp.save()

  return {
    success: true,
    data: {
      firewall: webapp.firewall,
    },
  }
}

/**
 */
export async function getFileList(
  server: Server,
  webapp: Webapp,
  folder: string
) {
  const res = await agentSvc.getFileList(server.address, webapp.name, folder)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
    data: {
      files: res.files,
    },
  }
}

/**
 */
export async function createFile(
  server: Server,
  webapp: Webapp,
  fileName: string
) {
  const res = await agentSvc.createFile(server.address, webapp.name, fileName)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function createFolder(
  server: Server,
  webapp: Webapp,
  fileName: string
) {
  const res = await agentSvc.createFolder(server.address, webapp.name, fileName)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function changeFileName(
  server: Server,
  webapp: Webapp,
  oldname: string,
  newname: string
) {
  const res = await agentSvc.changeFileName(
    server.address,
    webapp.name,
    oldname,
    newname
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function changeFilePermission(
  server: Server,
  webapp: Webapp,
  permission: string
) {
  const res = await agentSvc.changeFilePermission(
    server.address,
    webapp.name,
    permission
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

export async function getSummary(server: Server, webapp: Webapp) {
  await webapp.populate('owner').execPopulate()
  await webapp.populate('domain').execPopulate()

  return {
    success: true,
    data: {
      id: webapp._id,
      owner: webapp.owner?.name,
      totalDomainName: webapp.domains?.length,
      phpVersion: webapp.phpVersion,
      webAppStack: webapp.webAppStack,
      rootPath: webapp.rootPath,
      publicPath: webapp.publicPath,
      tdty: 16390,
      tdtm: 6390,
      dirSize: 6920301,
      sslMethod: webapp.sslMethod,
    },
  }
}

export async function storeWebSSL(
  server: Server,
  webapp: Webapp,
  payload: any
) {
  const domain = await webapp.findDomain(payload.domainId)

  const postData = {
    domain: domain.name,
    email: webapp.userEmail,
  }

  console.log('storeWebSSL, to agent', postData)
  const res = await agentSvc.createWebSSL(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  //webapp.sslMethod =
  //await webapp.save()

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}

export async function getCloneWebApplication(server: Server, webapp: Webapp) {
  return {
    success: true,
    data: {
      webappId: webapp.id,
    },
  }
}

export async function createCloneWebApplication(
  server: Server,
  webapp: Webapp,
  data: any
) {
  return {
    success: true,
    data: {
      webappId: webapp.id,
    },
  }
}

export async function changeOwner(webapp: Webapp, owner: string) {
  // check parameters
  const systemUser = await SystemUserModel.findById(owner)
  if (!systemUser) {
    throw new Error('The user doen not exists.')
  }

  webapp.owner = systemUser
  await webapp.save()

  return {
    success: true,
  }
}

export async function updateAuthentication(
  webapp: Webapp,
  { username, password }: { username: string; password: string }
) {
  return {
    success: true,
  }
}

export async function getActivityLogs(webapp: Webapp) {
  return {
    success: true,
  }
}
