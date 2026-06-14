# E-Commerce Features

This document provides a complete breakdown of all implemented features in **PetPaws** — covering every customer-facing capability and every administrator management function.

---

## Customer-Facing Features

### 1. Authentication & Security

| Feature | Description |
| :--- | :--- |
| **Sign Up** | Register with username, email, phone, and password. Email uniqueness is enforced at the database level. |
| **Sign In** | Authenticate with email and password. Returns a signed JWT valid for 7 days. |
| **JWT Session Management** | JWT is stored in `localStorage` and automatically attached to all API requests via an Axios request interceptor. |
| **Auto-Logout on Expiry** | A response interceptor globally catches `401 Unauthorized` responses, clears the stored token, and redirects to `/login`. |
| **Admin Login** | Separate admin login endpoint (`POST /api/auth/admin/login`) validates `role === 'admin'`. |
| **Profile Management** | Logged-in users can update their display name and phone number at any time. |
| **Password Change** | Users verify their current password before setting a new one (minimum 6 characters). |

---

### 2. Product Browsing & Search

| Feature | Description |
| :--- | :--- |
| **Full-Text Search** | Keyword search powered by a MongoDB text index across product `name`, `description`, `brand`, and `tags` fields. |
| **Category Filter** | Filter by any of 15 pet-specific categories (Dog Food, Cat Food, Toys, Grooming, Health & Supplements, etc.). |
| **Pet Type Filter** | Filter by pet (Dog, Cat, Bird, Fish, Rabbit, Hamster, Reptile). Products tagged `All` always appear. |
| **Price Range Filter** | Set minimum and maximum price bounds, or use quick-select buttons (Under ₹500 / ₹500–₹1000 / ₹1000–₹2500 / ₹2500+). |
| **Brand Filter** | Filter the catalog by any specific product brand. |
| **Sorting** | Sort results by: Newest First, Most Popular (soldCount), Top Rated, Price Low-to-High, Price High-to-Low. |
| **Pagination** | Results are paginated at 12 products per page with numbered navigation controls. |
| **Featured Products** | A dedicated homepage section and `/products?featured=true` listing for admin-flagged products. |
| **Related Products** | The product detail page dynamically fetches up to 6 products from the same category. |

---

### 3. Product Detail

| Feature | Description |
| :--- | :--- |
| **Image Gallery** | Main image display with a scrollable thumbnail strip for multi-image products. |
| **Variant Selection** | Size/weight variant buttons with per-variant pricing and stock state. |
| **Discount Badge** | Prominent percentage discount badge when a product has a discount applied. |
| **Stock Status** | Real-time stock indicator: In Stock / Only N left! / Out of Stock. |
| **Quantity Stepper** | Increment/decrement controls capped at available stock. |
| **Price Savings** | Shows original price crossed out, discounted price, and a green "Save ₹X" chip. |
| **Product Tags** | Displayed as pill tags for pet type, weight, brand, and other keywords. |

---

### 4. Shopping Cart

| Feature | Description |
| :--- | :--- |
| **Add to Cart** | Products can be added from the listing page (card hover button) or the detail page. Requires login for persistence. |
| **Persistent Cart** | Cart state is stored in MongoDB per user — survives page refresh and browser close. |
| **Quantity Update** | Inline stepper in the cart page to increase or decrease item quantity (capped by stock). |
| **Remove Item** | Individual items can be removed from the cart. |
| **Clear Cart** | One-click option to empty the entire cart. |
| **Real-Time Totals** | Subtotal, shipping fee (free above ₹500), 5% GST, and grand total are computed and displayed live. |
| **Cart Badge** | A count badge on the Navbar cart icon reflects the total number of items in the cart at all times. |
| **Inactive Product Filter** | On each cart fetch, products that have been deactivated by the admin are automatically removed. |

---

### 5. Wishlist

| Feature | Description |
| :--- | :--- |
| **Add / Remove** | Toggle wishlist status on any product from the listing, detail page, or wishlist page itself. |
| **Wishlist Page** | Dedicated `/wishlist` page showing all saved products with image, price, and discount. |
| **Move to Cart** | One-click move from wishlist to cart with automatic wishlist removal on success. |
| **Persistent Storage** | Wishlist is stored on the User document in MongoDB — available across all sessions. |

---

### 6. Multi-Step Checkout

| Step | Feature |
| :--- | :--- |
| **Step 1 — Address** | Select from saved addresses or enter a new one. Full form: name, phone, address lines, city, state (Indian state dropdown), pincode. |
| **Step 2 — Payment** | Choose payment method: Cash on Delivery (COD), Credit/Debit Card, UPI (with UPI ID input), Net Banking. Add optional order notes. |
| **Step 3 — Review** | Full order summary with edit links back to previous steps before final placement. |
| **Order Placement** | Server-side stock validation for every item before order creation. Calculates shipping (free above ₹500), 5% tax, and total. |
| **Stock Deduction** | Product `stock` is decremented and `soldCount` is incremented atomically upon successful order creation. |
| **Cart Clearing** | Cart is automatically emptied after a successful order. |

---

### 7. Order Management

| Feature | Description |
| :--- | :--- |
| **Order Confirmation** | Instant order confirmation page with Order ID, item list, and total after checkout. |
| **Order History** | `/orders` page lists all past orders with colour-coded status badges and product thumbnails. |
| **Status Filter Tabs** | Filter order history by: All / Pending / Confirmed / Shipped / Delivered / Cancelled. |
| **Order Detail Page** | Full breakdown: items, shipping address, payment method, price summary, status timeline. |
| **Visual Status Timeline** | Progress bar showing all 5 stages (Pending → Confirmed → Processing → Shipped → Delivered). |
| **Order Cancellation** | Users can cancel orders only in `Pending` or `Confirmed` status. Stock is restored on cancellation. |
| **Tracking Number** | Displays tracking number on the order detail page when set by admin. |

---

### 8. Product Reviews & Ratings

| Feature | Description |
| :--- | :--- |
| **Star Rating** | Interactive 1–5 star rating selector on the review form. |
| **Review Submission** | Logged-in users can submit a review title and detailed comment per product. |
| **One Review Per Product** | A compound unique index prevents the same user from reviewing the same product twice. |
| **Verified Purchase Badge** | Reviews from users who have a `Delivered` order containing the product are automatically marked as "Verified Purchase". |
| **Dynamic Rating Aggregation** | Product `ratings.average` and `ratings.count` are recalculated and saved after every review addition or deletion. |
| **Review Listing** | Approved reviews are displayed on the product detail page, sorted by newest first, with user avatar initials and date. |

---

### 9. Address Management

| Feature | Description |
| :--- | :--- |
| **Multiple Addresses** | Users can store multiple delivery addresses on their account. |
| **Default Address** | Marking an address as default automatically unsets any other default. The default address is pre-selected at checkout. |
| **Edit / Delete** | Full edit and delete capability for each saved address from the Profile page. |

---

## Admin Management Features

### 1. Admin Dashboard Analytics

| Feature | Description |
| :--- | :--- |
| **KPI Cards** | Live counts for Total Revenue, Total Orders, Total Customers, and Total Active Products. |
| **Monthly Revenue Chart** | Bar chart showing month-by-month revenue for the current year using MongoDB aggregation pipeline. |
| **Low Stock Alerts** | Table listing all active products with fewer than 10 units in stock, with category and stock count. |
| **Recent Orders** | Quick-view table of the 5 most recent orders with customer name, amount, and status. |
| **Top Products** | Ranked table of the 5 best-selling products by `soldCount` with product image and category. |

---

### 2. Product Catalog Management

| Feature | Description |
| :--- | :--- |
| **Product Listing** | Paginated table (15 per page) with image, name, brand, category, price, stock badge, rating, and featured status. |
| **Search Products** | Search by keyword in the admin products table. |
| **Category Filter** | Filter the admin product table by any category. |
| **Create Product** | Full creation form: name, description, brand, weight, tags, price, discount, stock, main image, additional images, category, pet type, featured toggle, active toggle. |
| **Edit Product** | Pre-populated form with all existing product data for in-place editing. |
| **Delete Product** | Soft-delete (`isActive: false`) to preserve historical order data integrity. |
| **Discount Preview** | Live preview of the computed discounted price as the admin types the discount percentage. |
| **Featured Toggle** | Checkbox to promote a product to the homepage Featured Products section. |

---

### 3. Order Fulfillment Management

| Feature | Description |
| :--- | :--- |
| **All Orders Table** | Paginated table (20 per page) with order ID, date, customer details, item count, total, payment status, and order status. |
| **Status Filter Tabs** | Filter all orders by any status stage. |
| **Order Detail View** | Full order breakdown showing items, customer info, shipping address, payment summary, and status history timeline. |
| **Status Update** | Dropdown to change order status through the full lifecycle (Pending → Confirmed → Processing → Shipped → Delivered or Cancelled). |
| **Tracking Number** | Input field to add a courier tracking number visible to the customer. |
| **Status Notes** | Optional note field recorded with each status change in the `statusHistory` array. |

---

### 4. Customer Management

| Feature | Description |
| :--- | :--- |
| **Customer Table** | Paginated list of all registered users (non-admin) with name, email, phone, join date, last login, and address count. |
| **Customer Search** | Search by name or email. |
| **Activate / Deactivate** | Toggle user account status. Deactivated users cannot log in. |

---

### 5. Store Settings Management

| Feature | Description |
| :--- | :--- |
| **General Info** | Edit store name, tagline, contact email, and contact phone number. |
| **Shipping Config** | Set the flat shipping fee and the order value threshold above which shipping is free. |
| **Tax Rate** | Set the GST/tax percentage applied to all orders. |
| **Banner Management** | Add, view, and delete homepage carousel banners (title, subtitle, image URL, link, active toggle). |
| **Category Overview** | View all configured product categories with their icons and active status. |

---

[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
