import Contact from '../models/Contact.js';
import ApiError from '../utils/apiError.js';

/**
 * Create a new contact submission
 */
export const createContactMessage = async (contactData) => {
  const contact = new Contact({
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    message: contactData.message
  });
  
  await contact.save();
  return contact;
};

/**
 * Retrieve all contact messages (sorted by latest)
 */
export const getAllContactMessages = async (query = {}) => {
  const { page = 1, limit = 20 } = query;
  
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const messages = await Contact.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(parsedLimit);

  const total = await Contact.countDocuments();

  return {
    messages,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit)
    }
  };
};

/**
 * Retrieve a specific contact message by ID
 */
export const getContactMessageById = async (id) => {
  const message = await Contact.findById(id);
  if (!message) {
    throw new ApiError(404, 'Contact message not found.');
  }
  return message;
};

/**
 * Delete a specific contact message by ID
 */
export const deleteContactMessage = async (id) => {
  const message = await Contact.findById(id);
  if (!message) {
    throw new ApiError(404, 'Contact message not found.');
  }
  await Contact.findByIdAndDelete(id);
  return true;
};
