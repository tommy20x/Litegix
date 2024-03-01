import { Document, Schema, model } from 'mongoose'

export interface Credittopup extends Document {
  level: number
}

var CredittopupSchema = new Schema<Credittopup>(
  {
    level: { type: Number, required: [true, "can't be blank"] },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

export default model<Credittopup>('Credittopup', CredittopupSchema)
