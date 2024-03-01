import { Document, Schema, model } from 'mongoose'

export interface PaymentHistory extends Document {
  type: string
  amount: number
  date: Date
  invoice: string
  receipt: string
  deleted: boolean
}

const PaymentHistorySchema = new Schema<PaymentHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"],
    },
    type: {
      type: String,
      required: [true, "can't be blank"],
    },
    amount: {
      type: Number,
      required: [true, "can't be blank"],
    },
    date: {
      type: Date,
      required: [true, "can't be blank"],
    },
    invoice: {
      type: String,
      required: [true, "can't be blank"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    receipt: {
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

export default model<PaymentHistory>('PaymentHistory', PaymentHistorySchema)
