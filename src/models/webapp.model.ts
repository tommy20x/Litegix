import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { SystemUser } from './systemUser.model'
import { Domain } from './domain.model'

export type PhpVersions = 'php7.2' | 'php7.3' | 'php7.4' | 'php8.0'

export type WebAppStack = 'nginx_apache2' | 'native_nginx' | 'nginx_custom'

export type SSLMethod = 'basic' | 'advanced'

export interface Wordpress {
  siteTitle: string
  adminName: string
  adminPassword: string
  adminEmail: String
  databaseName: string
  databasePass: string
  databaseUser: string
  tablePrefix: string
}
export interface GitRepository {
  provider: string
  githost: string
  repository: string
  branch: string
}

export interface WebappRequest {
  name: string
  owner: string
  isUserExists: boolean
  domain: Domain
  phpVersion: PhpVersions
  webAppStack: WebAppStack
  publicPath: string
  rootPath: string
  sslMethod: SSLMethod
  wordpress: Wordpress
}

export interface Firewall {
  state: boolean
  paranoiaLevel: number
  anomalyThreshold: number
  exclutions: Array<string>
}

export interface Webapp extends Document {
  name: string
  server: Server
  owner: SystemUser
  isUserExists: boolean
  domains: Array<Domain>
  git: GitRepository
  phpVersion: PhpVersions
  webAppStack: WebAppStack
  publicPath: string
  rootPath: string
  sslMethod: SSLMethod
  enableAutoSSL: boolean
  appType: string
  userEmail: string //we'll use this to update ssl for domains
  wordpress: Wordpress
  firewall: Firewall
  findDomain: (domainId: string) => Domain
  findDomainByName: (name: string) => Domain
}

var WebappSchema = new Schema<Webapp>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
    },
    appType: {
      type: String,
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    domains: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Domain',
      },
    ],
    publicPath: {
      type: String,
    },
    phpVersion: {
      type: String,
      required: [true, "can't be blank"],
    },
    webAppStack: String,
    stackMode: {
      type: String,
    },
    sslMethod: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableAutoSSL: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    userEmail: String,
    /*pullKey1: {
      type: String,
      required: [true, "can't be blank"],
    },
    pullKey2: {
      type: String,
      required: [true, "can't be blank"],
    },*/
    advancedSSL: {
      advancedSSL: { type: Boolean, default: false },
      autoSSL: { type: Boolean, default: false },
    },
    firewall: {
      state: {
        type: Boolean,
        default: false,
      },
      paranoiaLevel: Number,
      anomalyThreshold: Number,
      exclutions: [],
    },
    settings: {
      disableFunctions: String,
      timezone: String,
      maxExecutionTime: Number,
      maxInputTime: Number,
      maxInputVars: Number,
      memoryLimit: Number,
      postMaxSize: Number,
      uploadMaxFilesize: Number,
      allowUrlFopen: Boolean,
      sessionGcMaxlifetime: Number,
      processManager: String, //"dynamic", "ondemand", or "static"
      processManagerStartServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMinSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxSpareServers: Number, //REQUIRED IF PROCESSMANAGER IS "DYNAMIC"
      processManagerMaxChildren: Number,
      processManagerMaxRequests: Number,
      openBasedir: String,
      clickjackingProtection: Boolean,
      xssProtection: Boolean,
      mimeSniffingProtection: Boolean,
    },
    wordpress: {
      siteTitle: String,
      adminUserName: String,
      adminPassword: String,
      adminEmail: String,
      databaseName: String,
      databasePass: String,
      databaseUser: String,
      tablePrefix: String,
    },
    git: {
      provider: String,
      githost: String,
      repository: String,
      branch: String,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.server
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

WebappSchema.methods.findDomain = async function (
  domainId: string
): Promise<Domain> {
  const webapp = await this.populate('domains').execPopulate()
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const domain = webapp.domains.find((it) => it.id == domainId)
  if (!domain) {
    throw new Error("Domain doesn't exists")
  }

  return domain
}

WebappSchema.methods.findDomainByName = async function (
  name: string
): Promise<Domain | undefined> {
  const webapp = await this.populate('domains').execPopulate()
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  return webapp.domains.find((it) => it.name == name)
}

export default model<Webapp>('Webapp', WebappSchema)
