import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface ServerPlan extends Document {
  index: number
  packageName: string
  price: number
  server: Server
}

var ServerPlanSchema = new Schema<ServerPlan>(
  {
    index: {
      type: Number,
      required: [true, "can't be blank"],
    },
    packageName: {
      type: String,
      required: [true, "can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
  },
  {
    timestamps: true,
  }
)

export default model<ServerPlan>('ServerPlan', ServerPlanSchema)
