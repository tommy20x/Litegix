import { Document, Schema, model } from 'mongoose'

export interface Security extends Document {
  port: number
}

var SecuritySchema = new Schema<Security>(
  {
    sec_type: { type: String, required: true },
    port: { type: Number, required: true },
    protocol: { type: String, required: true },
    ip_address: { type: String, required: true },
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    server_id: { type: Schema.Types.ObjectId, ref: 'Server' },
  },
  { timestamps: true }
)

model('Security', SecuritySchema)
