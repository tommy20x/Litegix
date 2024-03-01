import { Document, Schema, model } from 'mongoose'
import { User } from './user.model'

export interface PaymentMethod extends Document {
  name: string
  country: string
  postcode: string
  cardNumber: string
  expire: Date
  cvc: string
  user: User
}

const PaymentMethodSchema = new Schema<PaymentMethod>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    country: {
      type: String,
      required: [true, "can't be blank"],
    },
    postcode: {
      type: String,
      required: [true, "can't be blank"],
    },
    cardNumber: {
      type: String,
      required: [true, "can't be blank"],
    },
    expire: {
      type: Date,
      required: [true, "can't be blank"],
    },
    cvc: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<PaymentMethod>('PaymentMethod', PaymentMethodSchema)
