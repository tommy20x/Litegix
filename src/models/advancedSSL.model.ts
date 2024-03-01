import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'
import { Domain } from './domain.model'

export interface AdvancedSSL extends Document {
  method: string
  enableHttp: boolean
  enableHsts: boolean
  webapp: Webapp
  domain: Domain
}

const AdvancedSSLSchema = new Schema<AdvancedSSL>(
  {
    method: {
      type: String,
      required: [true, "can't be blank"],
    },
    enableHttp: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    enableHsts: {
      type: Boolean,
      required: [true, "can't be blank"],
    },
    ssl_protocol_id: Number,

    staging: {
      type: Boolean,
      default: false,
    },
    api_id: Number,
    validUntil: Date,
    renewalDate: Date,

    authorizationMethod: String,
    externalApi: Number,
    environment: String,

    privateKey: String,
    certificate: String,

    csrKeyType: String,
    organization: String,
    department: String,
    city: String,
    state: String,
    country: String,
    webapp: {
      type: Schema.Types.ObjectId,
      ref: 'Webapp',
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: 'Domains',
    },
  },
  {
    timestamps: false,
  }
)

export default model<AdvancedSSL>('AdvancedSSL', AdvancedSSLSchema)
