import mongoose, { Schema } from 'mongoose'
import type { Product } from '@/lib/products'

export type ProductDocument = Product

const ProductSchema = new Schema<ProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    categories: { type: [String], required: true, default: [] },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: false },
    badge: { type: String, required: false },
    image: { type: String, required: true },
    images: { type: [String], required: false },
    description: { type: String, required: true },
    specs: { type: Schema.Types.Mixed, required: false },
    inStock: { type: Boolean, required: true, default: true },
    featured: { type: Boolean, required: false, default: false },
    tags: { type: [String], required: false },
    customerReviews: { type: [Schema.Types.Mixed], required: false },
    qaItems: { type: [Schema.Types.Mixed], required: false },
    shippingInfo: { type: Schema.Types.Mixed, required: false },
    warranty: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<ProductDocument>) ||
  mongoose.model<ProductDocument>('Product', ProductSchema)
