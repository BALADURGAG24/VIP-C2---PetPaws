const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Dog Food',
        'Cat Food',
        'Bird Food',
        'Fish Food',
        'Small Animal Food',
        'Dog Accessories',
        'Cat Accessories',
        'Toys',
        'Grooming',
        'Health & Supplements',
        'Cages & Habitats',
        'Beds & Furniture',
        'Leashes & Collars',
        'Clothing & Apparel',
        'Other',
      ],
    },
    subcategory: { type: String, default: '' },
    petType: {
      type: [String],
      enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'All'],
      default: ['All'],
    },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    image: { type: String, default: '' },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    weight: { type: String, default: '' },
    variants: [
      {
        size: String,
        weight: String,
        price: Number,
        stock: Number,
      },
    ],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search index
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

// Virtual for discount price
productSchema.pre('save', function (next) {
  if (this.discount > 0) {
    this.discountedPrice = Math.round(this.price - (this.price * this.discount) / 100);
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
