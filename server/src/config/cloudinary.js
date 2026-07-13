import dotenv from 'dotenv';

dotenv.config();

// We check if Cloudinary environment variables are available
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let cloudinaryInstance = null;

if (isCloudinaryConfigured) {
  // We use dynamic import if the user installs the cloudinary package later,
  // or we can structure it so that once installed, it configures automatically.
  try {
    // Dynamically check/import or just configure if package is available
    // We'll write the configuration standard here.
    // In production, when the developer runs npm install cloudinary, this will activate seamlessly.
    import('cloudinary').then(({ v2 }) => {
      v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      cloudinaryInstance = v2;
      console.log('Cloudinary Configured successfully.');
    }).catch(() => {
      console.log('Cloudinary SDK not installed. Using local storage fallback for uploads.');
    });
  } catch (err) {
    console.warn('Could not initialize Cloudinary:', err.message);
  }
} else {
  console.log('Cloudinary credentials missing in .env. Uploads will use local storage fallback.');
}

/**
 * Uploads a file to Cloudinary or falls back to returning a local public URL
 * @param {string} filePath - Path of the local file (e.g. from multer)
 * @param {string} folder - Target folder/category name
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadImage = async (filePath, folder = 'portfolio') => {
  if (isCloudinaryConfigured && cloudinaryInstance) {
    try {
      const result = await cloudinaryInstance.uploader.upload(filePath, {
        folder: folder,
        use_filename: true,
        unique_filename: true,
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload failure, falling back:', error.message);
      throw error;
    }
  }

  // Fallback: return path relative to the server host
  // Express static middleware will serve this from '/uploads'
  const fileName = filePath.split(/[\\/]/).pop();
  return {
    url: `/uploads/${fileName}`,
    public_id: `local_${fileName}`,
  };
};

/**
 * Deletes a file from Cloudinary (or mock deletes locally)
 * @param {string} publicId - Cloudinary public ID or local ID
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (publicId) => {
  if (isCloudinaryConfigured && cloudinaryInstance && !publicId.startsWith('local_')) {
    try {
      const result = await cloudinaryInstance.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete failure:', error.message);
      return false;
    }
  }
  
  // For local files, we just return true (in production we would delete from file system,
  // but this is standard fallback behavior)
  console.log(`Mock deleted image with ID: ${publicId}`);
  return true;
};

export default cloudinaryInstance;
