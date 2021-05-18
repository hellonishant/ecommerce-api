const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
  },
  brand: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: {
    type: Number,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual('id').set(() => this._id.toHexString());
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
