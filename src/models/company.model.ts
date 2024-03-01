import { Document, Schema, model } from 'mongoose'
//import uniqueValidator from 'mongoose-unique-validator'
import { User } from './user.model'

export interface Company extends Document {
  name: string
  address1: string
  address2: string
  city: string
  postal: number
  state: string
  country: string
  tax: number
  user: User
}

const CompanySchema = new Schema<Company>(
  {
    name: { type: String, required: [true, "can't be blank"], index: true },
    address1: String,
    address2: String,
    city: String,
    postal: Number,
    state: String,
    country: String,
    tax: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.user
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

//CompanySchema.plugin(uniqueValidator, { message: 'is already taken' })

export default model<Company>('Company', CompanySchema)
