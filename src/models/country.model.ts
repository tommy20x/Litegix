import { Document, Schema, model } from 'mongoose'

export interface Country extends Document {
  name: string
}

var CountrySchema = new Schema<Country>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
    },
  },
  { timestamps: false }
)

export default model<Country>('Country', CountrySchema)
