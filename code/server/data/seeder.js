const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const AdminSettings = require('../models/Admin');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petpaws');
  console.log('MongoDB Connected');
};

const products = [
  {
    name: 'Royal Canin Adult Dog Food - Chicken & Rice (10kg)',
    description: 'Scientifically formulated for adult dogs. Rich in chicken protein with balanced omega fatty acids for healthy skin and coat. Supports digestive health with precise fiber blend.',
    price: 3200,
    discount: 10,
    category: 'Dog Food',
    petType: ['Dog'],
    brand: 'Royal Canin',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stock: 50,
    weight: '10kg',
    tags: ['dog food', 'adult', 'chicken', 'premium'],
    isFeatured: true,
    ratings: { average: 4.5, count: 28 },
  },
  {
    name: 'Pedigree Adult Dog Food - Beef & Vegetables (3kg)',
    description: 'Complete and balanced nutrition for adult dogs. Made with real beef and garden vegetables. Supports strong bones and healthy muscles.',
    price: 850,
    discount: 5,
    category: 'Dog Food',
    petType: ['Dog'],
    brand: 'Pedigree',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    stock: 80,
    weight: '3kg',
    tags: ['dog food', 'beef', 'vegetables'],
    isFeatured: true,
    ratings: { average: 4.2, count: 45 },
  },
  {
    name: 'Whiskas Adult Cat Food - Ocean Fish (1.2kg)',
    description: 'Delicious ocean fish flavor that cats love. Provides complete nutrition with vitamins and minerals for a healthy, happy cat.',
    price: 420,
    discount: 8,
    category: 'Cat Food',
    petType: ['Cat'],
    brand: 'Whiskas',
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400',
    stock: 100,
    weight: '1.2kg',
    tags: ['cat food', 'ocean fish', 'adult cat'],
    isFeatured: true,
    ratings: { average: 4.3, count: 62 },
  },
  {
    name: 'Purina One Adult Cat Food - Chicken (3kg)',
    description: 'Premium cat food with real chicken as the #1 ingredient. Supports urinary tract health and strong immune system.',
    price: 1350,
    discount: 12,
    category: 'Cat Food',
    petType: ['Cat'],
    brand: 'Purina',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    stock: 65,
    weight: '3kg',
    tags: ['cat food', 'chicken', 'premium'],
    ratings: { average: 4.6, count: 33 },
  },
  {
    name: 'Trixie Dog Rope Toy - Multi-Color',
    description: 'Durable cotton rope toy for dogs. Perfect for interactive play and tug-of-war. Helps clean teeth and massage gums. Suitable for medium to large dogs.',
    price: 350,
    discount: 0,
    category: 'Toys',
    petType: ['Dog'],
    brand: 'Trixie',
    image: 'https://images.unsplash.com/photo-1601758174493-f49789de3e0b?w=400',
    stock: 120,
    tags: ['dog toy', 'rope', 'interactive'],
    isFeatured: true,
    ratings: { average: 4.4, count: 89 },
  },
  {
    name: 'Interactive Cat Feather Wand Toy',
    description: 'Stimulate your cat\'s natural hunting instincts with this colorful feather wand. Retractable design for easy storage. Hours of entertainment for indoor cats.',
    price: 220,
    discount: 15,
    category: 'Toys',
    petType: ['Cat'],
    brand: 'PetZone',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
    stock: 150,
    tags: ['cat toy', 'feather', 'interactive'],
    ratings: { average: 4.1, count: 54 },
  },
  {
    name: 'Pet Grooming Kit - 7 Piece Professional Set',
    description: 'Complete grooming set for dogs and cats. Includes slicker brush, de-shedding tool, nail clipper, comb, scissors, and more. Ergonomic handles for comfortable use.',
    price: 1200,
    discount: 20,
    category: 'Grooming',
    petType: ['Dog', 'Cat'],
    brand: 'GroomMaster',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    stock: 40,
    tags: ['grooming', 'brush', 'nail clipper', 'professional'],
    isFeatured: true,
    ratings: { average: 4.7, count: 21 },
  },
  {
    name: 'Adjustable Dog Harness - Red (M)',
    description: 'Comfortable no-pull harness with reflective strips for night visibility. Padded chest plate and breathable mesh. Easy to put on with two buckles.',
    price: 650,
    discount: 0,
    category: 'Dog Accessories',
    petType: ['Dog'],
    brand: 'PawsUp',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    stock: 75,
    tags: ['harness', 'dog accessories', 'no-pull'],
    variants: [
      { size: 'S', price: 599, stock: 20 },
      { size: 'M', price: 650, stock: 30 },
      { size: 'L', price: 699, stock: 25 },
    ],
    ratings: { average: 4.5, count: 67 },
  },
  {
    name: 'Cat Scratching Post with Platform (60cm)',
    description: 'Sturdy sisal rope scratching post with a cozy platform on top. Helps cats maintain healthy claws and stretch muscles. Base is weighted for stability.',
    price: 899,
    discount: 10,
    category: 'Cat Accessories',
    petType: ['Cat'],
    brand: 'CatComfort',
    image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=400',
    stock: 35,
    tags: ['scratching post', 'cat furniture', 'sisal'],
    ratings: { average: 4.3, count: 38 },
  },
  {
    name: 'Omega-3 Fish Oil Supplement for Dogs (250ml)',
    description: 'Pure Norwegian fish oil supplement for dogs. Supports joint health, promotes healthy skin and coat, boosts immune system. Suitable for all dog breeds and ages.',
    price: 750,
    discount: 0,
    category: 'Health & Supplements',
    petType: ['Dog'],
    brand: 'VetCare',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    stock: 60,
    tags: ['supplement', 'omega-3', 'fish oil', 'health'],
    isFeatured: true,
    ratings: { average: 4.8, count: 44 },
  },
  {
    name: 'Luxury Pet Bed - Plush Memory Foam (Large)',
    description: 'Orthopedic memory foam pet bed with waterproof inner liner and washable cover. Perfect for senior pets with joint problems. Non-slip bottom.',
    price: 2500,
    discount: 15,
    category: 'Beds & Furniture',
    petType: ['Dog', 'Cat'],
    brand: 'DreamPet',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stock: 25,
    tags: ['pet bed', 'orthopedic', 'memory foam', 'luxury'],
    variants: [
      { size: 'S (50x40cm)', price: 1800, stock: 10 },
      { size: 'M (70x55cm)', price: 2200, stock: 8 },
      { size: 'L (90x70cm)', price: 2500, stock: 7 },
    ],
    ratings: { average: 4.6, count: 15 },
  },
  {
    name: 'Stainless Steel Dog Bowl Set - 2 Bowls',
    description: 'Set of 2 premium stainless steel bowls for food and water. Non-slip rubber base. Dishwasher safe. Rust resistant and easy to clean.',
    price: 450,
    discount: 0,
    category: 'Dog Accessories',
    petType: ['Dog'],
    brand: 'PetBasics',
    image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400',
    stock: 90,
    tags: ['dog bowl', 'stainless steel', 'feeding'],
    ratings: { average: 4.4, count: 76 },
  },
  {
    name: 'Bird Cage with Stand - Large (80x60x150cm)',
    description: 'Spacious bird cage suitable for parrots, cockatiels, and larger birds. Comes with perches, feeding cups, and swing. Durable powder-coated steel frame.',
    price: 5500,
    discount: 8,
    category: 'Cages & Habitats',
    petType: ['Bird'],
    brand: 'BirdHome',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
    stock: 15,
    tags: ['bird cage', 'large cage', 'parrot', 'stand'],
    ratings: { average: 4.2, count: 12 },
  },
  {
    name: 'Premium Leather Dog Leash - 6ft',
    description: 'Genuine leather leash with chrome hardware. Soft and durable, comfortable to hold. Padded handle for extra comfort during long walks.',
    price: 850,
    discount: 5,
    category: 'Leashes & Collars',
    petType: ['Dog'],
    brand: 'LeatherPaws',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    stock: 55,
    tags: ['dog leash', 'leather', 'premium'],
    ratings: { average: 4.5, count: 29 },
  },
  {
    name: 'JerHigh Chicken Stick Dog Treats (100g)',
    description: 'Delicious chicken flavored stick treats for dogs. Made with real chicken. Perfect for training or as a daily reward. No artificial colors or flavors.',
    price: 180,
    discount: 0,
    category: 'Dog Food',
    petType: ['Dog'],
    brand: 'JerHigh',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
    stock: 200,
    tags: ['dog treats', 'chicken', 'training treats'],
    ratings: { average: 4.3, count: 112 },
  },
  {
    name: 'Aquarium Fish Tank - 30 Liters with LED',
    description: 'Complete aquarium starter kit with LED lighting, filter, thermometer, and fish net. Crystal clear glass panels. Perfect for tropical and freshwater fish.',
    price: 3800,
    discount: 12,
    category: 'Cages & Habitats',
    petType: ['Fish'],
    brand: 'AquaWorld',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400',
    stock: 20,
    tags: ['fish tank', 'aquarium', 'LED', '30 liter'],
    isFeatured: true,
    ratings: { average: 4.4, count: 31 },
  },
];

const adminSettings = {
  banners: [
    {
      title: 'Premium Pet Food Sale',
      subtitle: 'Up to 30% off on Royal Canin & Whiskas',
      image: 'https://images.unsplash.com/photo-1601758174493-f49789de3e0b?w=1200',
      link: '/products?category=Dog+Food',
      isActive: true,
      order: 1,
    },
    {
      title: 'Grooming Essentials',
      subtitle: 'Everything your pet needs to look & feel great',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
      link: '/products?category=Grooming',
      isActive: true,
      order: 2,
    },
  ],
  categories: [
    { name: 'Dog Food', slug: 'dog-food', icon: '🐶', petType: 'Dog', subcategories: ['Dry Food', 'Wet Food', 'Treats', 'Puppy Food', 'Senior Food'], isActive: true, order: 1 },
    { name: 'Cat Food', slug: 'cat-food', icon: '🐱', petType: 'Cat', subcategories: ['Dry Food', 'Wet Food', 'Treats', 'Kitten Food'], isActive: true, order: 2 },
    { name: 'Toys', slug: 'toys', icon: '🎾', petType: 'All', subcategories: ['Chew Toys', 'Interactive', 'Plush', 'Fetch'], isActive: true, order: 3 },
    { name: 'Grooming', slug: 'grooming', icon: '✂️', petType: 'All', subcategories: ['Brushes', 'Shampoo', 'Nail Care', 'Dental'], isActive: true, order: 4 },
    { name: 'Dog Accessories', slug: 'dog-accessories', icon: '🦮', petType: 'Dog', subcategories: ['Collars', 'Leashes', 'Bowls', 'Clothing'], isActive: true, order: 5 },
    { name: 'Cat Accessories', slug: 'cat-accessories', icon: '🐈', petType: 'Cat', subcategories: ['Scratching Posts', 'Litter', 'Carriers', 'Bowls'], isActive: true, order: 6 },
    { name: 'Health & Supplements', slug: 'health', icon: '💊', petType: 'All', subcategories: ['Vitamins', 'Joint Care', 'Skin & Coat', 'Digestive'], isActive: true, order: 7 },
    { name: 'Beds & Furniture', slug: 'beds', icon: '🛏️', petType: 'All', subcategories: ['Beds', 'Mats', 'Kennels', 'Furniture'], isActive: true, order: 8 },
  ],
  shippingFee: 50,
  freeShippingAbove: 500,
  taxRate: 5,
  siteName: 'PetPaws',
  siteTagline: 'Everything your pet needs',
};

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await AdminSettings.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    // Create admin user
    const admin = await User.create({
      username: 'Admin',
      email: 'admin@petpaws.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999',
    });

    // Create test user
    const user = await User.create({
      username: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      phone: '8888888888',
      addresses: [
        {
          fullName: 'John Doe',
          phone: '8888888888',
          addressLine1: '123 Pet Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
      ],
    });

    // Create products
    const createdProducts = await Product.insertMany(products);

    // Create admin settings
    await AdminSettings.create(adminSettings);

    // Create sample order
    const sampleOrder = await Order.create({
      user: user._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].image,
          price: 2880,
          quantity: 1,
        },
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          image: createdProducts[4].image,
          price: 350,
          quantity: 2,
        },
      ],
      shippingAddress: {
        fullName: 'John Doe',
        phone: '8888888888',
        addressLine1: '123 Pet Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      paymentMethod: 'COD',
      itemsPrice: 3580,
      shippingPrice: 0,
      taxPrice: 179,
      totalPrice: 3759,
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Pending', note: 'Order placed' },
        { status: 'Confirmed', note: 'Order confirmed' },
        { status: 'Shipped', note: 'Shipped via BlueDart' },
        { status: 'Delivered', note: 'Delivered successfully' },
      ],
      deliveredAt: new Date(),
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Admin:   admin@petpaws.com / admin123`);
    console.log(`👤 User:    john@example.com / user123`);
    console.log(`📦 Products: ${createdProducts.length} created`);
    console.log(`📋 Orders:  1 sample order created`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
