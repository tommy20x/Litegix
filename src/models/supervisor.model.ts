import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { SystemUser } from './systemUser.model'

export interface Supervisor extends Document {
  server: Server
  user: SystemUser
  name: string
  realName: string
}

var SupervisorSchema = new Schema<Supervisor>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
    },
    numprocs: {
      type: Number,
      required: [true, "can't be blank"],
    },
    vendorBinary: {
      type: String,
      required: [true, "can't be blank"],
    },
    command: {
      type: String,
      required: [true, "can't be blank"],
    },
    autoStart: Boolean,
    autoRestart: Boolean,
    directory: String,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: true,
  }
)

export default model<Supervisor>('Supervisor', SupervisorSchema)
