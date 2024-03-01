import { Document, Schema, model } from 'mongoose'

export interface Timezone extends Document {
  region: string
  zones: Array<string>
}

var TimezoneSchema = new Schema<Timezone>(
  {
    region: String,
    zones: [String],
  },
  { timestamps: false }
)

export default model<Timezone>('Timezone', TimezoneSchema)
