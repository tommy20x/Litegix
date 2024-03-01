import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface Usage extends Document {
  memory: string
  cpu: string
  disk: string
  loadavg: string
  server: Server
}

var UsageSchema = new Schema<Usage>(
  {
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    memory: String,
    cpu: String,
    disk: String,
    loadavg: String,
  },
  {
    timestamps: true,
  }
)

export default model<Usage>('Usage', UsageSchema)
