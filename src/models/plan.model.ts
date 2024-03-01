import { Document, Schema, model } from 'mongoose'

export interface Plan extends Document {
  name: string
  price: number
}

var PlanSchema = new Schema<Plan>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

export default model<Plan>('Plan', PlanSchema)
