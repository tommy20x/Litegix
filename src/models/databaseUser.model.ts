import { Document, Schema, model } from 'mongoose'
import { Server } from './server.model'
import { Database } from './database.model'

export interface DatabaseUser extends Document {
  name: string
  password: string
  server: Server
  database: Database
}

const DatabaseUserSchema = new Schema<DatabaseUser>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
    },
    database: {
      type: Schema.Types.ObjectId,
      ref: 'Database',
    }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.server
      },
    },
    timestamps: false,
  }
)

export default model<DatabaseUser>('DatabaseUser', DatabaseUserSchema)
