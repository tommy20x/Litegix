import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface IPAddress extends Document {
  address: string
  totalLogin?: number
  browser?: string
  user: User
}

const IPAddressSchema = new Schema<IPAddress>(
  {
    address: {
      type: String,
      required: true,
    },
    totalLogin: {
      type: Number,
      default: 0,
    },
    browser: {
      type: String,
      default: '',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.user
      },
    },
    timestamps: true,
  }
)

export default model<IPAddress>('IPAddress', IPAddressSchema)
