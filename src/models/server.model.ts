import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface SystemStatus {
  osVersion: string
  kernelVersion: string
  agentVersion: string
  processorName: string
  totalCPUCore: number
  totalMemory: number
  freeMemory: number
  diskTotal: number
  diskFree: number
  loadAvg: number
  uptime: string
}

export interface Installation {
  status: string
  message: string
  progress: number
}

export interface Server extends Document {
  name: string
  address: string
  provider: string
  webserver: string
  database: string
  phpVersion: string
  connected: boolean
  system: SystemStatus
  userEmail: string
  securityId: string
  securityKey: string
  installation: Installation
  user: User
  toSimpleJSON(): JSON
  toSummaryJSON(): JSON
}

const ServerSchema = new Schema<Server>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    address: {
      type: String,
      required: [true, "can't be blank"],
    },
    provider: String,
    webserver: String,
    database: String,
    phpVersion: String,
    connected: Boolean,
    system: {
      kernelVersion: String,
      processorName: String,
      totalCPUCore: Number,
      totalMemory: Number,
      freeMemory: Number,
      diskTotal: Number,
      diskFree: Number,
      loadAvg: Number,
      uptime: String,
      agentVersion: String,
      osVersion: String,
    },
    userEmail: {
      type: String,
      required: [false, 'must email formating'],
    },
    securityId: String,
    securityKey: String,
    SSHConfig: {
      Passwordless_Login_Only: { type: Boolean },
      Prevent_root_login: { type: Boolean },
      UseDNS: { type: Boolean },
    },
    AutoUpdate: {
      Third_Party_Software_Update: { type: Boolean },
      Security_Update: { type: Boolean },
    },
    installation: {
      status: String,
      message: String,
      progress: Number,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

ServerSchema.index({ user: 1, name: 1 }, { unique: true })
ServerSchema.index({ user: 1, address: 1 }, { unique: true })

ServerSchema.methods.toSimpleJSON = function () {
  return {
    id: this.id,
    name: this.name,
    address: this.address,
    connected: this.connected,
    webserver: this.webserver,
    database: this.database,
  }
}

ServerSchema.methods.toSummaryJSON = function () {
  return {
    ...this.system,
    name: this.name,
    address: this.address,
  }
}

export default model<Server>('Server', ServerSchema)
