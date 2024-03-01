import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface ActivityLog extends Document {
  label: string
  log: string
  server: Server
}

const ActivityLogSchema = new Schema<ActivityLog>(
  {
    label: {
      type: String,
      required: [true, "can't be blank"],
    },
    log: {
      type: String,
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

export default model<ActivityLog>('ActivityLog', ActivityLogSchema)
