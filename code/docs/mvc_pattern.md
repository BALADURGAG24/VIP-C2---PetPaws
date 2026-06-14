# MVC Pattern in MERN

This document explains how the classic **Model-View-Controller (MVC)** architectural pattern is applied across the **PetPaws** MERN codebase, mapping each conceptual layer to specific files and responsibilities.

---

## Architecture Diagram

```
       [ BROWSER ] ◄───────────────────────────────────────────┐
            │                                                  │
            ▼                                                  │
┌───────────────────────────────┐                              │
│            VIEW               │  React.js SPA                │ HTTP
│                               │  (pages/ + components/)      │ JSON
│  • Home.jsx                   │                              │ Response
│  • Products.jsx               │                              │
│  • ProductDetail.jsx          │                              │
│  • Cart.jsx / Checkout.jsx    │                              │
│  • Admin/Dashboard.jsx        │                              │
│  • AuthContext / CartContext  │                              │
└───────────────┬───────────────┘                              │
                │                                              │
                │  Axios HTTP Requests                         │
                │  POST /api/orders                            │
                │  GET /api/products?category=Dog+Food         │
                ▼                                              │
┌──────────────────────────────────────────────────────────┐   │
│                   SERVER (Node.js / Express.js)          │   │
│                                                          │   │
│  ┌─────────────────────────────────────────────────┐     │   │
│  │               ROUTER (routes/*.js)              │     │   │
│  │                                                 │     │   │
│  │  authRoutes.js       productRoutes.js           │     │   │
│  │  cartRoutes.js       orderRoutes.js             │     │   │
│  │  userRoutes.js       reviewRoutes.js            │     │   │
│  │  wishlistRoutes.js   adminRoutes.js             │     │   │
│  └──────────────────────┬──────────────────────────┘     │   │
│                         │                                │   │
│                         │  protect()  adminOnly()        │   │
│                         │  (middleware/auth.js)          │   │
│                         ▼                                │   │
│  ┌─────────────────────────────────────────────────┐     │   │
│  │           CONTROLLER (controllers/*.js)         │     │───┘
│  │                                                 │     │
│  │  authController.js   productController.js       │     │
│  │  cartController.js   orderController.js         │     │ 
│  │  userController.js   reviewController.js        │     │
│  │  wishlistController  adminController.js         │     │
│  └──────────────────────┬──────────────────────────┘     │
│                         │                                │
│                         │  Mongoose queries              │
│                         ▼                                │
│  ┌─────────────────────────────────────────────────┐     │
│  │             MODEL (models/*.js)                 │     │
│  │                                                 │     │
│  │  User.js      Product.js     Order.js           │     │
│  │  Cart.js      Review.js      Admin.js           │     │
│  └──────────────────────┬──────────────────────────┘     │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   DATABASE    │
                  │   (MongoDB)   │
                  └───────────────┘
```

---

## MVC Core Division

### 1. View Layer — React.js Client (`client/src/`)

The View is the entire React SPA. It renders UI based on state, handles user interactions, and communicates with the backend exclusively through Axios HTTP requests.

| Responsibility | Implementation |
| :--- | :--- |
| **UI Rendering** | Functional components in `pages/` and `components/` |
| **Global Auth State** | `AuthContext.jsx` — user, login(), logout(), updateUser() |
| **Global Cart State** | `CartContext.jsx` — cart, addToCart(), updateItem(), removeItem() |
| **Routing** | React Router v6 with `<ProtectedRoute>` wrappers |
| **API Communication** | `utils/api.js` — Axios instance with interceptors |
| **User Notifications** | react-hot-toast for non-blocking feedback |

**Data flow in the View:**
```
User interaction
    → Event handler (onClick, onSubmit)
        → API call via utils/api.js (Axios)
            → Context state update OR local useState update
                → Component re-renders with new data
```

**Key View files by concern:**

```
pages/User/Home.jsx           — Homepage: hero, categories, featured products
pages/User/Products.jsx       — Listing with sidebar filter panel
pages/User/ProductDetail.jsx  — Gallery, variants, reviews, add-to-cart
pages/User/Cart.jsx           — Cart table with quantity controls
pages/User/Checkout.jsx       — 3-step checkout wizard
pages/User/Orders.jsx         — Order history with status filter
pages/User/OrderDetail.jsx    — Order tracking timeline
pages/User/Profile.jsx        — Profile tabs: info, password, addresses
pages/User/Wishlist.jsx       — Saved products grid
pages/Auth/Login.jsx          — JWT login form
pages/Auth/Register.jsx       — Account creation form
pages/Admin/Dashboard.jsx     — KPI cards + charts + tables
pages/Admin/AdminProducts.jsx — Product CRUD table
pages/Admin/AdminOrders.jsx   — Order management table
pages/Admin/AdminUsers.jsx    — Customer management table
pages/Admin/AdminSettings.jsx — Store configuration
```

---

### 2. Router Layer — Express Routes (`server/routes/`)

The Router is the entry point for every incoming HTTP request. It defines URL patterns and HTTP verbs, chains middleware, and delegates execution to the appropriate controller function. No business logic lives in the router.

```javascript
// routes/productRoutes.js — example

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    getProducts, getProduct, getFeaturedProducts,
    createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');

// Public routes — no middleware
router.get('/',           getProducts);
router.get('/featured',   getFeaturedProducts);
router.get('/:id',        getProduct);

// Protected admin routes — middleware chained
router.post('/',     protect, adminOnly, createProduct);
router.put('/:id',   protect, adminOnly, updateProduct);
router.delete('/:id',protect, adminOnly, deleteProduct);

module.exports = router;
```

**Middleware execution order per request:**
```
Express App
    → cors()
    → express.json()
    → Router (url + method match)
        → protect() [if private route]
            → adminOnly() [if admin route]
                → Controller function
```

---

### 3. Controller Layer — Business Logic (`server/controllers/`)

Controllers are the heart of the backend. Each controller function is an `async (req, res)` handler that:

1. Reads and validates input from `req.body`, `req.params`, or `req.query`
2. Applies business rules (e.g., stock validation, ownership checks, price computation)
3. Calls Mongoose model methods to read or write data
4. Formats and returns a JSON response with an appropriate HTTP status code
5. Catches and forwards errors via try/catch

```javascript
// controllers/orderController.js — createOrder example

const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, orderItems } = req.body;

        // 1. Validate input
        if (!orderItems || orderItems.length === 0)
            return res.status(400).json({ success: false, message: 'No order items' });

        // 2. Apply business rules — validate stock per item
        let itemsPrice = 0;
        const validatedItems = [];
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive)
                return res.status(400).json({ message: `Product not available` });
            if (product.stock < item.quantity)
                return res.status(400).json({ message: `Insufficient stock` });
            validatedItems.push({ /* snapshot of price at order time */ });
            itemsPrice += product.discountedPrice * item.quantity;
        }

        // 3. Compute shipping and tax from AdminSettings
        const settings = await AdminSettings.findOne();
        const shippingPrice = itemsPrice >= settings.freeShippingAbove ? 0 : settings.shippingFee;
        const taxPrice = Math.round((itemsPrice * settings.taxRate) / 100);
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        // 4. Persist to database
        const order = await Order.create({ user: req.user._id, orderItems: validatedItems, ... });

        // 5. Side effects — deduct stock, clear cart
        for (const item of validatedItems)
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, soldCount: item.quantity }});
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        // 6. Return response
        res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

**All controllers in PetPaws:**

| File | Key Functions |
| :--- | :--- |
| `authController.js` | `register`, `login`, `adminLogin`, `getMe` |
| `productController.js` | `getProducts`, `getProduct`, `getFeaturedProducts`, `getRelatedProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `getBrands` |
| `cartController.js` | `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart` |
| `orderController.js` | `createOrder`, `getMyOrders`, `getOrder`, `cancelOrder`, `getAllOrders`, `updateOrderStatus` |
| `userController.js` | `updateProfile`, `changePassword`, `addAddress`, `updateAddress`, `deleteAddress`, `getAllUsers`, `toggleUserStatus` |
| `reviewController.js` | `addReview`, `getProductReviews`, `deleteReview` |
| `wishlistController.js` | `getWishlist`, `toggleWishlist`, `removeFromWishlist` |
| `adminController.js` | `getDashboardStats`, `getSettings`, `updateSettings`, `addBanner`, `deleteBanner`, `addCategory` |

---

### 4. Model Layer — Mongoose Schemas (`server/models/`)

The Model layer defines the shape and rules of every piece of data stored in MongoDB. Models are implemented using Mongoose and provide:

- **Schema validation** — Required fields, enum constraints, min/max values, unique indexes
- **Pre-save hooks** — Automatic actions before saving (e.g., password hashing, price computation)
- **Instance methods** — Custom functions on documents (e.g., `comparePassword`)
- **Indexes** — Performance optimization for common queries (text search, compound unique constraints)

```javascript
// models/Product.js — key design patterns

const productSchema = new mongoose.Schema({ /* fields */ }, { timestamps: true });

// Text search index for keyword queries
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

// Pre-save hook — auto-compute discountedPrice
productSchema.pre('save', function(next) {
    if (this.discount > 0)
        this.discountedPrice = Math.round(this.price - (this.price * this.discount / 100));
    else
        this.discountedPrice = this.price;
    next();
});

module.exports = mongoose.model('Product', productSchema);
```

```javascript
// models/User.js — security hooks and methods

// Pre-save hook — hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method — compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## Advantages of MVC in PetPaws

| Advantage | How It Applies |
| :--- | :--- |
| **Separation of Concerns** | React handles rendering; Express handles routing/logic; Mongoose handles data — no layer knows how the other is implemented. |
| **Scalability** | Adding a new feature (e.g., coupons) only requires creating a new model, controller, and route file — no changes to existing code. |
| **Reusability** | Controller functions like `protect` and `adminOnly` middleware are reused across all protected routes. |
| **Testability** | Each controller function is a pure async function that can be unit-tested independently by mocking `req`, `res`, and Mongoose models. |
| **Collaboration-Friendly** | Frontend developers work in `client/src/`; backend developers work in `server/`; database engineers work in `server/models/` — minimal conflicts. |
| **Maintainability** | Bug fixes and feature additions are localized. A pricing logic change only requires editing `orderController.js`. |

---

[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
