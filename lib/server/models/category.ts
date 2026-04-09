import mongoose, { Schema } from 'mongoose'

export interface CategoryDocument {
  name: string
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const CategoryModel =
  (mongoose.models.Category as mongoose.Model<CategoryDocument>) ||
  mongoose.model<CategoryDocument>('Category', CategorySchema)
