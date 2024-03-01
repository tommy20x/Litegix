import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface Service extends Document {
  name: string
  cpuUsage: number
  memoryUsage: number
  status: string
  server: Server
}

var ServiceSchema = new Schema<Service>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    cpuUsage: Number,
    memoryUsage: Number,
    status: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    timestamps: false,
  }
)

export default model<Service>('Service', ServiceSchema)
