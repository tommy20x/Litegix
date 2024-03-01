import { Document, Schema, model } from 'mongoose'
import { Webapp } from './webapp.model'

export type DomainType = 'primay' | 'atlas'

export type DomainSelection = 'litegix_domain' | 'custom_domain'

export type DomainIntegration = 'None' | 'Cloudflare'

export enum W3DomainVersion {
  NOWN,
  WWW,
  NON_WWW,
}

export interface Domain extends Document {
  name: string
  type: DomainType
  selection: DomainSelection
  wwwEnabled: boolean
  wwwVersion?: W3DomainVersion
  dnsIntegration?: DomainIntegration
  status?: string
  webapp?: Webapp
}

const DomainSchema = new Schema<Domain>(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
    },
    type: {
      type: String,
      required: [true, "can't be blank"],
    },
    litegix_domain: {
      type: Boolean,
      default: false,
    },
    wwwEnabled: {
      type: Boolean,
      default: false,
    },
    wwwVersion: {
      type: Number,
      default: 0,
    },
    dnsIntegration: {
      type: String,
    },
    status: String,
    webapp: {
      type: Schema.Types.ObjectId,
      ref: 'Webapp',
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret.webapp
        delete ret._id
        delete ret.__v
      },
    },
    timestamps: false,
  }
)

export default model<Domain>('Domain', DomainSchema)
