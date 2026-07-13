import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environmental variables
dotenv.config();

import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import Settings from '../models/Settings.js';
import Contact from '../models/Contact.js';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database.');

    // 1. Wipe current collections
    console.log('Clearing existing collections...');
    await Admin.deleteMany({});
    await Product.deleteMany({});
    await Testimonial.deleteMany({});
    await Settings.deleteMany({});
    await Contact.deleteMany({});
    console.log('Collections cleared.');

    // 2. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminShowcaseSecurePass2026!';
    
    console.log(`Creating Admin account: ${adminEmail}`);
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword
    });
    // Saves and hashes automatically via Mongoose pre-save hook
    await admin.save();
    console.log('Admin account created successfully.');

    // 3. Seed Website Settings
    console.log('Initializing global settings...');
    const defaultSettings = new Settings({
      businessName: 'Luxe Craft Showcase',
      phone: '+1 (555) 019-2834',
      whatsapp: '+1 (555) 019-9988',
      email: 'hello@luxecraft.com',
      instagram: 'https://instagram.com/luxecraft_showcase',
      address: '742 Amberwood Lane, Design District, NY 10001',
      aboutText: 'Luxe Craft Showcase represents the pinnacle of handcrafted products. Our boutique portfolio highlights products engineered with premium materials, built for durability, and customized for the discerning consumer. Explore our collection and connect with our team directly.',
      logo: {
        url: '/uploads/default-logo.png',
        public_id: 'local_logo'
      },
      heroImage: {
        url: '/uploads/default-hero.jpg',
        public_id: 'local_hero'
      }
    });
    await defaultSettings.save();
    console.log('Global settings initialized.');

    // 4. Seed Products
    console.log('Seeding sample products...');
    const sampleProducts = [
      {
        name: 'The Heritage Leather Backpack',
        shortDescription: 'Handcrafted full-grain leather backpack designed for daily carry and premium aesthetic appeal.',
        description: 'The Heritage Leather Backpack is built using vegetable-tanned full-grain leather that develops a unique patina over time. Featuring solid brass hardware, double-stitched reinforcements, and dedicated slots for laptops up to 16 inches. Every bag is hand-finished in our local workshop.',
        category: 'Bags',
        availableColors: ['Chestnut Brown', 'Charcoal Black', 'Tan Olive'],
        availableSizes: ['Standard (20L)', 'Compact (15L)'],
        material: 'Full-Grain Vegetable-Tanned Leather',
        features: [
          'Water-resistant canvas lining',
          'Padded laptop sleeve (fits up to 16")',
          'Solid brass buckles and zippers',
          'Hidden pocket for passport and phone'
        ],
        isFeatured: true,
        isActive: true,
        images: [
          { url: '/uploads/leather-backpack-1.jpg', public_id: 'local_backpack_1' },
          { url: '/uploads/leather-backpack-2.jpg', public_id: 'local_backpack_2' }
        ]
      },
      {
        name: 'Vanguard Chronograph Watch',
        shortDescription: 'Precision quartz movement chronograph with surgical-grade steel frame and sapphire crystal glass.',
        description: 'A classic aesthetic combined with robust engineering. The Vanguard Chronograph features high-precision quartz internals, custom chronometer sub-dials, and is pressure-resistant up to 50 meters. Fitted with an interchangeable genuine leather strap.',
        category: 'Watches',
        availableColors: ['Midnight Silver', 'Rose Gold', 'Stealth Black'],
        availableSizes: ['40mm Dial', '42mm Dial'],
        material: '316L Stainless Steel & Sapphire Glass',
        features: [
          'Japanese Chronograph Quartz Movement',
          'Scratch-resistant Sapphire Crystal',
          '5 ATM (50m) Water Resistance',
          'Luminescent hours and hands'
        ],
        isFeatured: true,
        isActive: true,
        images: [
          { url: '/uploads/vanguard-watch-1.jpg', public_id: 'local_watch_1' }
        ]
      },
      {
        name: 'Aero Knit Minimalist Sneakers',
        shortDescription: 'Breathable, sustainable knit sneakers engineered for cloud-like foot comfort.',
        description: 'Crafted from recycled ocean plastics and organic eucalyptus fibers. The Aero Knit features a custom impact-absorbing sole and ergonomic form fitting that moves naturally with your stride. Fully machine washable and engineered with sustainable practices.',
        category: 'Footwear',
        availableColors: ['Ocean Grey', 'Forest Green', 'Sandstone Beige'],
        availableSizes: ['US 8', 'US 9', 'US 10', 'US 11'],
        material: 'Recycled Ocean Plastic Knit & Sugarcane EVA Sole',
        features: [
          'Breathable lightweight upper mesh',
          'Odor-resistant wool insole lining',
          'Machine washable on cold cycle',
          'Carbon-negative sole manufacturing'
        ],
        isFeatured: false,
        isActive: true,
        images: [
          { url: '/uploads/sneakers-1.jpg', public_id: 'local_sneakers_1' }
        ]
      },
      {
        name: 'Summit Merino Wool Overcoat',
        shortDescription: 'Tailored heavy-duty overcoat crafted from premium Australian merino wool.',
        description: 'Designed to offer supreme thermal protection without adding unnecessary bulk. The Summit Overcoat offers a sleek, structured silhouette, double-breasted buttoning, and soft satin lining. Perfect for formal layers and colder climates.',
        category: 'Apparel',
        availableColors: ['Camel Brown', 'Navy Blue', 'Classic Black'],
        availableSizes: ['S', 'M', 'L', 'XL'],
        material: '100% Australian Merino Wool & Satin Lining',
        features: [
          'Double-breasted button closures',
          'Deep interior chest pockets',
          'Wind-resistant lapel structure',
          'Dry clean only'
        ],
        isFeatured: true,
        isActive: true,
        images: [
          { url: '/uploads/wool-overcoat-1.jpg', public_id: 'local_overcoat_1' }
        ]
      }
    ];

    for (const prod of sampleProducts) {
      await Product.create(prod);
    }
    console.log('Sample products seeded successfully.');

    // 5. Seed Testimonials
    console.log('Seeding customer testimonials...');
    const sampleTestimonials = [
      {
        customerName: 'Sarah Jenkins',
        message: 'The Heritage Leather Backpack is worth every single dollar. I have carried it daily for over six months, and it has already aged beautifully. The craft quality is unmatched!',
        source: 'WhatsApp',
        rating: 5,
        isFeatured: true,
        image: { url: '/uploads/sarah-avatar.jpg', public_id: 'local_sarah' }
      },
      {
        customerName: 'Marcus Brodie',
        message: 'Absolutely love the minimal look of the Vanguard Watch. I get compliments on it during every board meeting. Prompt delivery and premium presentation box!',
        source: 'Instagram DM',
        rating: 5,
        isFeatured: true,
        image: { url: '/uploads/marcus-avatar.jpg', public_id: 'local_marcus' }
      },
      {
        customerName: 'Evelyn Ortiz',
        message: 'Super lightweight and feels like walking on air. Will be buying a second pair in Forest Green. Eco-friendly packaging was a nice touch.',
        source: 'Text',
        rating: 4,
        isFeatured: false
      },
      {
        customerName: 'David Vance',
        message: 'Received the Summit Merino Wool Overcoat today. Fits exactly as sized and the camel color looks even better in person than the showcase pictures.',
        source: 'Instagram Story',
        rating: 5,
        isFeatured: true
      }
    ];

    for (const test of sampleTestimonials) {
      await Testimonial.create(test);
    }
    console.log('Sample testimonials seeded successfully.');

    console.log('Database Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed with error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
