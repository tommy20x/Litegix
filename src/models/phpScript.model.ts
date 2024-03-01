import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'

export interface PHPScript extends Document {
  webapp: Webapp
  name: string
  realName: string
}

var PHPScriptSchema = new Schema<PHPScript>(
  {
    webapp: {
      type: Schema.Types.ObjectId,
      ref: 'Webapp',
    },
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    realName: {
      type: String,
      required: [true, "can't be blank"],
    },
  },
  {
    timestamps: false,
  }
)

export default model<PHPScript>('PHPScript', PHPScriptSchema)
