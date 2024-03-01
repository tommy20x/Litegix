import { Document, Schema, model } from 'mongoose'

export interface BackupPlan extends Document {
  index: number
  packageName: string
  price: number
}

const BackupPlanSchema = new Schema<BackupPlan>(
  {
    index: {
      type: Number,
      required: [true, "can't be blank"],
    },
    packagename: {
      type: String,
      required: [true, "can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "can't be blank"],
    },
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

export default model<BackupPlan>('Backupplan', BackupPlanSchema)
