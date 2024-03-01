import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface Subscription extends Document {
  user: User
}

var SubscriptionSchema = new Schema<Subscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    serverPlan: {
      count: { type: Number, required: [true, "can't be blank"] },
      price: { type: Number, required: [true, "can't be blank"] },
    },
    backupPlan: {
      count: { type: Number, required: [true, "can't be blank"] },
      price: { type: Number, required: [true, "can't be blank"] },
    },
    userBalance: { type: Number, required: [false, "can't be blank"] },
  },
  {
    timestamps: true,
  }
)

export default model<Subscription>('Subscription', SubscriptionSchema)
