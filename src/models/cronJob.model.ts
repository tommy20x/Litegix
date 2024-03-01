import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { SystemUser } from './systemUser.model'

export interface CronJob extends Document {
  label: string
  user: SystemUser
  time: string
  command: string
  vendor_binary: string
  predef_setting: string
  server: Server
}

const CronJobSchema = new Schema<CronJob>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    label: {
      type: String,
      required: [true, "can't be blank"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
    },
    time: {
      type: String,
      required: [true, "can't be blank"],
    },
    command: {
      type: String,
      required: [true, "can't be blank"],
    },
    vendor_binary: {
      type: String,
      required: [true, "can't be blank"],
    },
    predef_setting: {
      type: String,
      required: [true, "can't be blank"],
    },
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

export default model<CronJob>('CronJob', CronJobSchema)
