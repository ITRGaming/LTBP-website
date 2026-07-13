import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true,
    default: 'local_placeholder' // Local storage identifier
  }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required.'],
      maxlength: [300, 'Short description cannot exceed 300 characters.'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Full description is required.'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
      index: true
    },
    images: {
      type: [productImageSchema],
      default: []
    },
    availableColors: {
      type: [String],
      default: []
    },
    availableSizes: {
      type: [String],
      default: []
    },
    material: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // Hide from query results by default
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Automatic Slug generation before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

// Compound search index for name, description, and category
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
