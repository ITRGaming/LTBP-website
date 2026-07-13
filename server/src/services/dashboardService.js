import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';

/**
 * Get dashboard statistics for the admin dashboard
 * @returns {Promise<{totalProducts: number, featuredProducts: number, totalTestimonials: number, totalContacts: number}>}
 */
export const getDashboardStats = async () => {
  // Execute counts in parallel to minimize response times
  const [totalProducts, featuredProducts, totalTestimonials, totalContacts] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isFeatured: true, isDeleted: false }),
    Testimonial.countDocuments(),
    Contact.countDocuments()
  ]);

  return {
    totalProducts,
    featuredProducts,
    totalTestimonials,
    totalContacts
  };
};
