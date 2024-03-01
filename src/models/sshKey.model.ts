import { Document, Schema, model } from 'mongoose'
import { SystemUser } from './systemUser.model'
import { Server } from './server.model'

export interface SSHKey extends Document {
  label: string
  publicKey: string
  user: SystemUser
  server: Server
}

const SSHKeySchema = new Schema<SSHKey>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'SystemUser',
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: [true, "can't be blank"],
    },
    label: {
      type: String,
      required: [true, "can't be blank"],
    },
    publicKey: {
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

export default model<SSHKey>('SSHKey', SSHKeySchema)
