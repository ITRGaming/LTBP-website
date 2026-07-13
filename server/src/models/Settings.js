import mongoose from 'mongoose';

const settingsImageSchema = new mongoose.Schema({
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

const settingsSchema = new mongoose.Schema(
  {
    logo: {
      type: settingsImageSchema,
      required: false
    },
    businessName: {
      type: String,
      required: [true, 'Business Name is required.'],
      default: 'My Showcase Business',
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Business Phone is required.'],
      default: '+1234567890',
      trim: true
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required.'],
      default: '+1234567890',
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Business Email is required.'],
      default: 'contact@mybusiness.com',
      lowercase: true,
      trim: true
    },
    instagram: {
      type: String,
      trim: true,
      default: 'https://instagram.com/mybusiness'
    },
    address: {
      type: String,
      trim: true,
      default: '123 Business St, Showcase City'
    },
    heroImage: {
      type: settingsImageSchema,
      required: false
    },
    aboutText: {
      type: String,
      trim: true,
      default: 'Welcome to our portfolio showcase site. We provide top tier craft and products.'
    }
  },
  {
    timestamps: true
  }
);

// We can add a helper static method to easily retrieve the settings document
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    // Initialize default settings document if none exists
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
