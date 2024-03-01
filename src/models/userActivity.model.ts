import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface UserActivity extends Document {
  category: number
  level: number
  message: string
  date: Date
  user: User
}

const UserActivitySchema = new Schema<UserActivity>(
  {
    category: { type: Number, required: [true, "can't be blank"] },
    level: { type: Number, required: [true, "can't be blank"] },
    message: { type: String, required: [true, "can't be blank"] },
    date: { type: Date, required: [true, "can't be blank"] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.user
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<UserActivity>('UserActivity', UserActivitySchema)
