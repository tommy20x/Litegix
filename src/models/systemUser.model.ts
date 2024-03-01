import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface SystemUser extends Document {
  name: string
  password: string
  deploymentKey: string
  server: Server
  getJson(): JSON
  toDeploymentKeyJson(): JSON
}

const SystemUserSchema = new Schema<SystemUser>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    name: { type: String, required: [true, "can't be blank"] },
    password: { type: String, required: [true, "can't be blank"] },
    deploymentKey: { type: String },
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

SystemUserSchema.methods.getJson = function () {
  return {
    id: this._id,
    name: this.name,
  }
}

SystemUserSchema.methods.toDeploymentKeyJson = function () {
  return {
    id: this._id,
    name: this.name,
    deploymentKey: this.deploymentKey,
  }
}

export default model<SystemUser>('SystemUser', SystemUserSchema)
