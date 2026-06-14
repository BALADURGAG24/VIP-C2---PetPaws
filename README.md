# 🐾 PetPaws - Pet Foods & Accessories Store

A complete MERN stack e-commerce application for a pet foods and accessories store.

---

## 📁 Project Structure

```
petshop/
├── client/                  # React.js Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/       # AdminLayout
│   │   │   └── Common/      # Navbar, Footer, ProductCard
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── Admin/       # Dashboard, Products, Orders, Users, Settings
│   │   │   ├── Auth/        # Login, Register
│   │   │   └── User/        # Home, Products, ProductDetail, Cart, Checkout, etc.
│   │   └── utils/           # API client (Axios)
│   └── package.json
└── server/                  # Node.js + Express.js Backend
    ├── config/              # MongoDB connection
    ├── controllers/         # auth, product, cart, order, user, review, wishlist, admin
    ├── data/                # Seed data
    ├── middleware/          # JWT auth
    ├── models/              # User, Product, Order, Cart, Review, Admin
    ├── routes/              # All API routes
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone <repo-url>
cd petshop
```

---

### 2. Backend Setup

```bash
cd server
npm install

# Copy env file and configure
cp .env.example .env
```

Edit `.env`:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/petpaws
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Seed the database:**
```bash
npm run seed
```

This creates:
- 👑 Admin: `admin@petpaws.com` / `admin123`
- 👤 User: `john@example.com` / `user123`
- 16 sample products across all categories
- Sample order and settings

**Start the backend:**
```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

Server runs at: `http://localhost:8000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite proxy forwards all `/api/*` requests to `http://localhost:8000`.

---

### 4. Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Customer storefront |
| `http://localhost:5173/admin` | Admin panel |
| `http://localhost:5173/login` | Login page |
| `http://localhost:8000/api/health` | API health check |

---

## 🗃️ Database Models

### User
- username, email, password (bcrypt hashed)
- phone, avatar, role (user/admin)
- addresses (array), wishlist (product refs)
- isActive, lastLogin

### Product
- name, description, price, discountedPrice, discount
- category (15 types), petType (8 types), brand
- images, stock, weight, variants
- ratings.average, ratings.count
- tags, isFeatured, isActive, soldCount

### Order
- user, orderItems (product, name, image, price, qty, variant)
- shippingAddress, paymentMethod, paymentStatus
- itemsPrice, shippingPrice, taxPrice, totalPrice
- orderStatus, statusHistory, trackingNumber

### Cart
- user, items (product, name, image, price, qty, variant, stock)

### Review
- user, product, rating (1-5), title, comment
- isVerifiedPurchase, isApproved

### AdminSettings
- banners, categories, shippingFee, freeShippingAbove, taxRate
- siteName, siteTagline, contactEmail, contactPhone

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/admin/login` | Public | Admin login |
| GET | `/api/auth/me` | User | Get current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | Get all (filters, pagination) |
| GET | `/api/products/featured` | Public | Featured products |
| GET | `/api/products/brands` | Public | All brands |
| GET | `/api/products/:id` | Public | Single product + reviews |
| GET | `/api/products/:id/related` | Public | Related products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Soft-delete product |

**Query Parameters (GET /api/products):**
- `keyword`, `category`, `petType`, `brand`
- `minPrice`, `maxPrice`, `rating`
- `sort` (newest, popular, rating, price_asc, price_desc)
- `page`, `limit`, `featured`

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Add item |
| PUT | `/api/cart/:itemId` | User | Update quantity |
| DELETE | `/api/cart/:itemId` | User | Remove item |
| DELETE | `/api/cart` | User | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/my` | User | My orders |
| GET | `/api/orders/:id` | User | Order detail |
| PUT | `/api/orders/:id/cancel` | User | Cancel order |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/profile` | User | Update profile |
| PUT | `/api/users/password` | User | Change password |
| POST | `/api/users/addresses` | User | Add address |
| PUT | `/api/users/addresses/:id` | User | Update address |
| DELETE | `/api/users/addresses/:id` | User | Delete address |
| GET | `/api/users` | Admin | All users |
| PUT | `/api/users/:id/toggle` | Admin | Toggle status |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | User | Get wishlist |
| POST | `/api/wishlist/:productId` | User | Toggle item |
| DELETE | `/api/wishlist/:productId` | User | Remove item |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | User | Add review |
| GET | `/api/reviews/product/:id` | Public | Product reviews |
| DELETE | `/api/reviews/:id` | User/Admin | Delete review |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/settings` | Admin | Get settings |
| PUT | `/api/admin/settings` | Admin | Update settings |
| POST | `/api/admin/banners` | Admin | Add banner |
| DELETE | `/api/admin/banners/:id` | Admin | Delete banner |
| POST | `/api/admin/categories` | Admin | Add category |

---

## ✅ Features Implemented

### Customer Features
- ✅ User registration & login with JWT
- ✅ Product browsing with advanced filters (category, pet type, price, brand, rating)
- ✅ Product search with text indexing
- ✅ Product detail with image gallery, variants, reviews
- ✅ Shopping cart (add, update qty, remove, clear)
- ✅ Wishlist (add/remove, move to cart)
- ✅ Multi-step checkout (address → payment → review)
- ✅ Order placement with stock validation
- ✅ Order tracking with status timeline
- ✅ Order cancellation
- ✅ Product reviews & star ratings
- ✅ Verified purchase badge on reviews
- ✅ Profile management (name, phone)
- ✅ Password change
- ✅ Multiple saved addresses
- ✅ Order history with status filters
- ✅ Responsive mobile design

### Admin Features
- ✅ Admin dashboard with revenue charts, top products, low stock alerts
- ✅ Product management (create, edit, delete, featured toggle)
- ✅ Category and pet type filter for products
- ✅ Order management (view, update status, add tracking number)
- ✅ Customer management (view, activate/deactivate)
- ✅ Store settings (shipping fee, free shipping threshold, tax rate)
- ✅ Banner management for homepage

### Technical Features
- ✅ JWT authentication with refresh on every request
- ✅ Password hashing with bcryptjs
- ✅ Automatic discount price calculation
- ✅ Stock management (deduct on order, restore on cancel)
- ✅ Sorted/paginated API responses
- ✅ Text search with MongoDB indexes
- ✅ Axios interceptors for auth headers and 401 redirect
- ✅ React Context for auth and cart state
- ✅ Vite proxy for seamless API calls in development

---

## 🎨 Product Categories

- 🐶 Dog Food (Dry, Wet, Treats, Puppy, Senior)
- 🐱 Cat Food (Dry, Wet, Treats, Kitten)
- 🐦 Bird Food
- 🐠 Fish Food
- 🐾 Dog Accessories (Collars, Leashes, Bowls, Clothing)
- 🐈 Cat Accessories (Scratching Posts, Litter, Carriers)
- 🎾 Toys (Chew, Interactive, Plush, Fetch)
- ✂️ Grooming (Brushes, Shampoo, Nail Care, Dental)
- 💊 Health & Supplements (Vitamins, Joint, Skin & Coat)
- 🛏️ Beds & Furniture
- 🏠 Cages & Habitats
- 🔗 Leashes & Collars
- 👕 Clothing & Apparel
- 🐇 Small Animal Food
- 🌟 Other

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)
```bash
# Set environment variables:
MONGO_URI=mongodb+srv://...
JWT_SECRET=strong_secret_here
NODE_ENV=production
PORT=8000
```

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder

# Set environment variable:
VITE_API_URL=https://your-backend-url.com
```

Update `vite.config.js` proxy target for staging, or update `src/utils/api.js` baseURL.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Vite 5 |
| Styling | Pure CSS with CSS Variables |
| State | React Context API |
| HTTP Client | Axios with interceptors |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Icons | react-icons (Feather) |
| Notifications | react-hot-toast |

---

## 📞 Support

- Admin email: admin@petpaws.com
- Default admin password: admin123
- Test user: john@example.com / user123
