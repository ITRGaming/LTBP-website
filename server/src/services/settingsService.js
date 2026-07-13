import Settings from '../models/Settings.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

/**
 * Get global website settings (creates default if it doesn't exist)
 */
export const getGlobalSettings = async () => {
  return await Settings.getSettings();
};

/**
 * Update global settings (supports uploading logo and heroImage)
 */
export const updateGlobalSettings = async (settingsData, files = {}) => {
  const settings = await Settings.getSettings();

  // Handle Logo Upload if present
  if (files.logo && files.logo[0]) {
    // Delete existing logo from Cloudinary/local mock if it exists
    if (settings.logo && settings.logo.public_id) {
      await deleteImage(settings.logo.public_id);
    }
    const uploadResult = await uploadImage(files.logo[0].path, 'settings');
    settings.logo = uploadResult;
  }

  // Handle Hero Image Upload if present
  if (files.heroImage && files.heroImage[0]) {
    // Delete existing hero image if it exists
    if (settings.heroImage && settings.heroImage.public_id) {
      await deleteImage(settings.heroImage.public_id);
    }
    const uploadResult = await uploadImage(files.heroImage[0].path, 'settings');
    settings.heroImage = uploadResult;
  }

  // Update other text fields
  const textFields = [
    'businessName', 'phone', 'whatsapp', 'email', 'instagram', 'address', 'aboutText'
  ];

  textFields.forEach(field => {
    if (settingsData[field] !== undefined) {
      settings[field] = settingsData[field];
    }
  });

  await settings.save();
  return settings;
};
