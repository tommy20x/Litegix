import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface Channel extends Document {
  service: string
  name: string
  address?: string
  user: User
}

const ChannelSchema = new Schema<Channel>(
  {
    service: {
      type: String,
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    address: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.user
      },
    },
    timestamps: true,
  }
)

export default model<Channel>('Channel', ChannelSchema)
