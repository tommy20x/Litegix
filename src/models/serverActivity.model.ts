import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'

export interface ServerActivity extends Document {
  category: number
  level: number
  message: string
  date: Date
  server: Server
}

const ServerActivitySchema = new Schema<ServerActivity>(
  {
    category: {
      type: Number,
      required: [true, "can't be blank"],
    },
    level: {
      type: Number,
      required: [true, "can't be blank"],
    },
    message: {
      type: String,
      required: [true, "can't be blank"],
    },
    date: {
      type: Date,
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: false,
  }
)

export default model<ServerActivity>('ServerActivity', ServerActivitySchema)
