# Roles and Responsibilities

This document defines the Role-Based Access Control (RBAC) design for **PetPaws**, mapping every role to its permitted actions and the middleware that enforces those permissions at the API level.

---

## RBAC Matrix

| Role | Responsibilities | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Guest / Visitor** | Browse products and research | • View homepage, featured products, and category listings. <br>• Search and filter the product catalog. <br>• View individual product detail pages and reviews. <br>• Add items to a local (non-persisted) cart view. <br>• Register for a new account or log in. |
| **Registered User** | Shop, manage orders, and personalise account | • All Guest permissions. <br>• Persistent shopping cart stored in MongoDB. <br>• Add and remove products from wishlist. <br>• Complete multi-step checkout and place orders. <br>• View full order history and real-time order status. <br>• Cancel eligible orders (Pending or Confirmed status). <br>• Submit product reviews and star ratings. <br>• Manage profile details, password, and multiple delivery addresses. |
| **Administrator** | Manage all store operations | • All Registered User permissions. <br>• Access the secure `/admin` panel. <br>• Full CRUD on all product listings (create, edit, delete, toggle featured). <br>• View and update the status of all customer orders. <br>• Add courier tracking numbers and internal status notes. <br>• View, search, activate, and deactivate customer accounts. <br>• Configure store settings (shipping fees, tax rate, banners, categories). <br>• Access dashboard analytics (revenue, top products, low stock alerts). |

---

## Route-Level Access Control

The table below maps every API route group to the minimum role required to access it.

| Route | Method | Min. Role | Notes |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Open registration |
| `/api/auth/login` | POST | Public | Returns JWT on success |
| `/api/auth/admin/login` | POST | Public | Validates admin role server-side |
| `/api/auth/me` | GET | Registered User | Returns full user profile |
| `/api/products` | GET | Public | Supports all query filters |
| `/api/products/featured` | GET | Public | Homepage featured products |
| `/api/products/:id` | GET | Public | Product detail + reviews |
| `/api/products` | POST | **Admin** | Create new product |
| `/api/products/:id` | PUT | **Admin** | Edit product |
| `/api/products/:id` | DELETE | **Admin** | Soft-delete product |
| `/api/cart` | GET/POST/PUT/DELETE | Registered User | Full cart management |
| `/api/wishlist` | GET/POST/DELETE | Registered User | Full wishlist management |
| `/api/orders` | POST | Registered User | Place new order |
| `/api/orders/my` | GET | Registered User | Own order history |
| `/api/orders/:id` | GET | Registered User / Admin | Own order or any (admin) |
| `/api/orders/:id/cancel` | PUT | Registered User | Own orders only |
| `/api/orders` | GET | **Admin** | All orders across all users |
| `/api/orders/:id/status` | PUT | **Admin** | Update order status |
| `/api/users/profile` | PUT | Registered User | Update own profile |
| `/api/users/password` | PUT | Registered User | Change own password |
| `/api/users/addresses` | POST/PUT/DELETE | Registered User | Manage own addresses |
| `/api/users` | GET | **Admin** | List all customers |
| `/api/users/:id/toggle` | PUT | **Admin** | Activate/deactivate user |
| `/api/reviews` | POST | Registered User | Submit product review |
| `/api/reviews/product/:id` | GET | Public | View product reviews |
| `/api/reviews/:id` | DELETE | Registered User / Admin | Own review or any (admin) |
| `/api/admin/dashboard` | GET | **Admin** | Analytics dashboard data |
| `/api/admin/settings` | GET/PUT | **Admin** | Store configuration |
| `/api/admin/banners` | POST/DELETE | **Admin** | Homepage banner management |

---

## Middleware Design

### `protect` — Token Verification

Applied to all routes that require a logged-in user (Registered User or Admin). Reads the JWT from the `Authorization` header, verifies it using `process.env.JWT_SECRET`, and attaches the decoded user to `req.user`.

```javascript
// middleware/auth.js

const protect = async (req, res, next) => {
    let token;

    // Read token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        // Verify signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach full user object to request (excluding password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Reject deactivated accounts
        if (!req.user.isActive) {
            return res.status(401).json({ success: false, message: 'Account has been deactivated' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};
```

---

### `adminOnly` — Role Authorization

Chained after `protect` on Admin-only routes. Checks that the authenticated user carries the `admin` role.

```javascript
// middleware/auth.js

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};
```

---

### `generateToken` — JWT Creation

Called in `authController.js` upon successful registration or login.

```javascript
// middleware/auth.js

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};
```

---

### Middleware Chaining in Routes

```javascript
// routes/productRoutes.js

const { protect, adminOnly } = require('../middleware/auth');

// Public — no middleware
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin only — both middlewares chained
router.post('/',     protect, adminOnly, createProduct);
router.put('/:id',   protect, adminOnly, updateProduct);
router.delete('/:id',protect, adminOnly, deleteProduct);
```

```javascript
// routes/orderRoutes.js

// Registered user only
router.post('/',           protect, createOrder);
router.get('/my',          protect, getMyOrders);
router.put('/:id/cancel',  protect, cancelOrder);

// Admin only
router.get('/',            protect, adminOnly, getAllOrders);
router.put('/:id/status',  protect, adminOnly, updateOrderStatus);
```

---

## Frontend Route Protection

On the client side, a `<ProtectedRoute>` component wraps private pages. It reads the current user from `AuthContext` and redirects unauthenticated users to `/login`.

```jsx
// App.jsx

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;

    if (!user) return <Navigate to="/login" replace />;

    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
};
```

**Usage in route definitions:**

```jsx
{/* Registered user route */}
<Route path="/checkout" element={
    <ProtectedRoute>
        <Checkout />
    </ProtectedRoute>
} />

{/* Admin-only route */}
<Route path="/admin/dashboard" element={
    <ProtectedRoute adminOnly>
        <Dashboard />
    </ProtectedRoute>
} />
```

---

[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
