import mongoose from 'mongoose';

const PRODUCT_SCHEMA = 'Product';

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: { type: Schema.Types.String, default: '' },
  category: { type: Schema.Types.String, default: '' },
  price: { type: Schema.Types.Number, default: 0 },
  brand: { type: Schema.Types.String, default: '' },
  size: { type: Schema.Types.String, default: '' },
  // Add more fields as needed
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toObject: { virtuals: false, getters: true },
  toJSON: { virtuals: false, getters: true },
});

export const Product = mongoose.model(PRODUCT_SCHEMA, ProductSchema);
