const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  link: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  petType: { type: String, default: 'All' },
  subcategories: [String],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const adminSettingsSchema = new mongoose.Schema(
  {
    banners: [bannerSchema],
    categories: [categorySchema],
    shippingFee: { type: Number, default: 50 },
    freeShippingAbove: { type: Number, default: 500 },
    taxRate: { type: Number, default: 5 },
    siteName: { type: String, default: 'PetPaws' },
    siteTagline: { type: String, default: 'Everything your pet needs' },
    contactEmail: { type: String, default: 'support@petpaws.com' },
    contactPhone: { type: String, default: '+91-9999999999' },
    featuredCategories: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
