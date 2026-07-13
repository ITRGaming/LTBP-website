import mongoose from 'mongoose';

const testimonialImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true,
    default: 'local_placeholder'
  }
}, { _id: false });

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message content is required.'],
      trim: true
    },
    image: {
      type: testimonialImageSchema,
      required: false
    },
    source: {
      type: String,
      required: [true, 'Testimonial source is required.'],
      enum: {
        values: ['WhatsApp', 'Instagram DM', 'Instagram Story', 'Text'],
        message: 'Source must be either: WhatsApp, Instagram DM, Instagram Story, or Text.'
      },
      default: 'Text'
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot exceed 5.'],
      required: false
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Only track creation date as requested
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
