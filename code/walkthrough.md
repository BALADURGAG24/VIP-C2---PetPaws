# PetPaws E-Commerce UI Walkthrough

Welcome to the **PetPaws** E-Commerce UI Walkthrough! This document provides a page-by-page guide to every interface in the application — covering the full customer storefront and the administrator panel.

All screenshots are stored inside the repository under the `screenshots/` directory.

---

## 📸 UI Screenshots & Flow

### 1. Homepage (Landing Page)

The PetPaws homepage is the entry point for all visitors. It dynamically loads featured products and category data from MongoDB on each visit.

**What you see:**
- A full-width **hero banner** with a 3-slide auto-rotating carousel (Pet Food Sale → Grooming Essentials → Cat Products). Each slide has a floating emoji animation and two CTA buttons.
- A **Trust Badges strip** directly below the hero: Free Shipping, Genuine Products, Top Rated, Easy Returns.
- A **Shop by Category** grid (8 cards with emoji icons): Dog Food, Cat Food, Toys, Grooming, Dog Accessories, Cat Accessories, Health & Supplements, Beds & Furniture.
- A **Featured Products** grid — admin-flagged products displayed in a 4-column responsive card layout.
- A **Shop by Pet Type** banner row with 4 coloured panels: For Dogs, For Cats, For Birds, For Fish.
- A **Sign Up CTA** section at the bottom inviting visitors to create an account.

![PetPaws Homepage](./screenshots/homepage.png)

---

### 2. Product Listing Page

The Products page is the main browsing interface. It renders a responsive product grid alongside a collapsible filter sidebar.

**What you see:**
- **Page header** showing the active filter label (e.g., "Dog Food" or `Results for "royal canin"`) and the total product count.
- **Filter Sidebar** (left panel) with:
  - Category radio list (15 categories)
  - Pet Type radio list (7 pet types + All)
  - Price Range inputs with quick-select buttons (Under ₹500 / ₹500–₹1000 / ₹1000–₹2500 / ₹2500+)
  - A "Clear All" filters button when filters are active
- **Sort Dropdown** (top right): Newest First, Most Popular, Top Rated, Price Low-to-High, Price High-to-Low.
- **Product Grid** — responsive auto-fill layout (min 240px per card, up to 4 columns).
- **Pagination** — numbered page buttons at the bottom.
- An empty state screen ("No products found") with a paw emoji and a Clear Filters button.

![Products Listing Page](./screenshots/products.png)

---

### 3. Product Detail Page

Clicking any product card navigates to the full product detail page.

**What you see:**
- **Breadcrumb navigation**: Home › Products › [Category] › [Product Name]
- **Image panel** (left): Large main image with a thumbnail strip below for additional images. A discount badge overlays the top-left corner.
- **Product information panel** (right):
  - Category pill, product name (H1), brand line
  - Star rating display with count
  - Price block: discounted price in large font, original price crossed out, green "Save ₹X" chip
  - Stock status badge: In Stock (green) / Only N left! (yellow) / Out of Stock (red)
  - Variant buttons for size/weight selection (where applicable)
  - Quantity stepper (capped at stock level)
  - **Add to Cart** (primary), **Buy Now** (secondary), **Wishlist heart** (icon) action row
  - Delivery info box: Free delivery above ₹500, 7-day returns
  - Product tag pills
- **Tabbed section** below: Description tab and Reviews tab.
  - Reviews tab shows a write-review form (for logged-in users) and the list of approved reviews with star ratings, verified purchase badge, and reviewer initials avatar.
- **Related Products** grid at the bottom.

![Product Detail Page](./screenshots/product_detail.png)

---

### 4. Shopping Cart

The cart page is accessible at `/cart` without login, but item persistence requires a logged-in session.

**What you see:**
- **Cart items table** (left panel):
  - Columns: Product (image + name + variant), Price, Quantity stepper, Total, Remove button
  - Inactive product cleanup notice (if any product was deactivated since adding to cart)
  - Clear Cart and Continue Shopping buttons in the footer row
- **Order Summary card** (right panel, sticky):
  - Subtotal, Shipping (FREE in green if above ₹500, or ₹50), Tax (5%), Grand Total
  - Free shipping progress hint: "Add ₹X more for free shipping" with a truck icon
  - **Proceed to Checkout** button (large, full-width)
  - Accepted payment method icons: Card, UPI, Net Banking, COD
- Empty cart state with a cart emoji and "Start Shopping" button.

![Shopping Cart](./screenshots/cart.png)

---

### 5. Checkout — Step 1: Shipping Address

The first step of the multi-step checkout wizard.

**What you see:**
- **Step progress bar** at the top: Step 1 (active/orange) → Step 2 → Step 3
- **Saved Addresses** section: Quick-select buttons for any address stored on the user's profile
- Divider and label: "Or enter new address:"
- **Address form**: Full Name, Phone, Address Line 1, Address Line 2 (optional), City, Pincode (side by side), State (dropdown with all Indian states)
- "Continue to Payment →" button
- **Order Summary sidebar** (right): Item thumbnails with quantity badge, subtotal, shipping, tax, and total.

![Checkout Step 1](./screenshots/checkout_address.png)

---

### 6. Checkout — Step 2: Payment Method

**What you see:**
- **Step progress bar**: Step 1 (done/green) → Step 2 (active/orange) → Step 3
- **Payment method radio cards** with icons:
  - 💵 Cash on Delivery
  - 💳 Credit / Debit Card
  - 📱 UPI Payment (reveals a UPI ID text input when selected)
  - 🏦 Net Banking
- **Order Notes** textarea (optional)
- "← Back" ghost button and "Review Order →" primary button
- Card info notice for Card selection: "Card payment simulation — no real transaction for demo"

![Checkout Step 2](./screenshots/checkout_payment.png)

---

### 7. Checkout — Step 3: Review & Confirm

**What you see:**
- **Step progress bar**: Steps 1 and 2 (done/green) → Step 3 (active/orange)
- **Shipping to** block with Edit link → shows confirmed address
- **Payment** block with Edit link → shows selected method
- **Items** block: Each item with thumbnail, name, variant, quantity, and line total
- "← Back" button and **"Place Order · ₹[Total]"** primary button (shows grand total inline)

![Checkout Step 3](./screenshots/checkout_review.png)

---

### 8. Order Confirmation

Displayed immediately after a successful order placement.

**What you see:**
- Large green checkmark icon
- "Order Confirmed! 🎉" heading
- "Your order ID is **#[8-char ID]**" subline
- Order Items card: product thumbnails, names, quantities, line totals
- Total Paid and payment method/status row
- Three action buttons: **Track Order**, **All Orders**, **Continue Shopping**

![Order Confirmation](./screenshots/order_confirmation.png)

---

### 9. My Orders (Order History)

Located at `/orders`, only accessible to logged-in users.

**What you see:**
- Status filter tab buttons: All / Pending / Confirmed / Shipped / Delivered / Cancelled
- **Order cards list** — each card shows:
  - Order ID (monospace, truncated to last 8 chars)
  - Date placed and item count
  - Grand total (large, bold)
  - Colour-coded status badge (Yellow=Pending, Blue=Confirmed, Orange=Shipped, Green=Delivered, Red=Cancelled)
  - Up to 4 product thumbnail images with "+N more" overflow indicator
  - Right-pointing chevron indicating the card is clickable

![My Orders](./screenshots/orders.png)

---

### 10. Order Detail & Tracking

**What you see:**
- Back to Orders breadcrumb link
- Order ID, placement date, and status badge in the header
- **Status Timeline** (horizontal progress bar with 5 steps) — completed steps filled in green
- **Order Items** card: image, product link, variant, price × quantity, line total
- **Shipping Address** card (left): name, phone, full address
- **Payment Details** card (right): method, status chip, full price breakdown (subtotal, shipping, tax, total)
- Tracking number info box (blue background) when a number has been added by admin
- **Cancel Order** button (visible only for Pending/Confirmed status, danger red)

![Order Detail](./screenshots/order_detail.png)

---

### 11. User Profile

Located at `/profile`, the account management hub.

**What you see:**
- Profile header: large initial avatar, username, and email
- **3 tab buttons**: Profile / Password / Addresses
- **Profile tab**: Full Name (editable), Email (read-only with note), Phone (editable), Save Changes button
- **Password tab**: Current Password, New Password, Confirm Password fields with Save button
- **Addresses tab**:
  - "+ Add Address" button (top right)
  - Saved address cards with name, phone, full address, Default badge, Edit and Delete icon buttons
  - Inline address form (shown on add or edit): grid layout with all fields and state dropdown

![User Profile](./screenshots/profile.png)

---

### 12. Wishlist

Located at `/wishlist`.

**What you see:**
- Page header: "My Wishlist" with saved item count
- **Product grid**: same card layout as the products page but with a red Trash icon button (top-right of image) for removal
- **Move to Cart** button replaces the standard Add to Cart button
- Empty state with a heart icon, message, and "Discover Products" link

![Wishlist](./screenshots/wishlist.png)

---

### 13. Login Page

**What you see:**
- Centered card on a gradient background (orange-to-blue-to-green)
- PetPaws paw logo + wordmark at the top
- "Welcome back!" heading, subtitle
- Email field with mail icon, Password field with lock icon and show/hide toggle
- **Sign In** submit button
- **Demo Accounts** section with two quick-fill buttons (👑 Admin Login, 👤 User Login)
- "Don't have an account? Create Account" link

![Login Page](./screenshots/login.png)

---

### 14. Register Page

**What you see:**
- Same centered card + gradient background as Login
- Fields: Full Name, Email Address, Phone Number (optional), Password, Confirm Password
- All password fields have show/hide eye toggle
- **Create Account** submit button
- "Already have an account? Sign In" link

![Register Page](./screenshots/register.png)

---

### 15. Admin Dashboard

Accessible only to admins at `/admin/dashboard`. Features a dark-themed collapsible sidebar.

**What you see:**
- **Sidebar** (dark, 240px): PetPaws paw logo, nav items with icons (Dashboard, Products, Orders, Customers, Settings), Sign Out at the bottom. Collapses to 64px icon-only mode.
- **Topbar**: Hamburger toggle, breadcrumb label, notification bell, admin user avatar chip
- **4 KPI Stat Cards**: Total Revenue (₹), Total Orders (with pending count), Customers, Products — each with a coloured icon background
- **Monthly Revenue Bar Chart**: Proportional bar heights representing revenue per month of the current year with ₹k labels
- **Low Stock Alert table**: Products with fewer than 10 units — name, category, stock badge (yellow or red)
- **Recent Orders table**: Order ID (linked), customer name, amount, status badge — last 5 orders
- **Top Products table**: Ranked by soldCount with product image, category, sold count badge

![Admin Dashboard](./screenshots/admin_dashboard.png)

---

### 16. Admin — All Products

**What you see:**
- Header with product count and "+ Add Product" button
- **Filter bar**: Keyword search input + Search button, Category dropdown filter
- **Products table**: Image + name + brand, Category badge, Price (with strikethrough original), Stock badge (green/yellow/red), Rating (star + count), Featured badge, Actions (View 🔗, Edit ✏️, Delete 🗑️)
- Numbered pagination at the bottom

![Admin Products](./screenshots/admin_products.png)

---

### 17. Admin — Add / Edit Product

**What you see:**
- Two-column layout with a "← Back" button and "Save Product" button in the header
- **Left column**:
  - Basic Info card: name, description, brand, weight, tags
  - Pricing & Stock card: price, discount %, stock — with a live green discounted price preview
  - Images card: main image URL with preview thumbnail, additional images with add/remove controls
- **Right column**:
  - Category card: dropdown with 15 pet categories
  - Suitable For card: multi-select toggle buttons for each pet type
  - Settings card: Featured Product checkbox, Active/Visible checkbox

![Admin Product Form](./screenshots/admin_product_form.png)

---

### 18. Admin — All Orders

**What you see:**
- Status filter tab buttons at the top
- **Orders table**: Order ID (monospace), Date, Customer (name + email), Items count, Total, Payment (method + status badge), Order Status badge, View eye button
- Pagination at the bottom

![Admin Orders](./screenshots/admin_orders.png)

---

### 19. Admin — Order Detail

**What you see:**
- Two-column layout: main content (left) + action sidebar (right)
- Order header: ID, date, status badge
- **Order Items card**: product thumbnails, names, variants, quantities, line totals
- **Customer card** (left): name, email, phone
- **Shipping Address card** (right): full address
- **Status History timeline**: each status change with timestamp and note
- **Right sidebar — Update Status form**: Status dropdown, Tracking Number input, Note textarea, Update Status button
- **Payment Summary card**: full price breakdown + payment method/status chip

![Admin Order Detail](./screenshots/admin_order_detail.png)

---

### 20. Admin — Customers

**What you see:**
- Header with total customer count
- Search bar (search by name or email)
- **Customers table**: Avatar initial, name + email, phone, Join Date, Last Login, Address count, Status badge (Active/Inactive), Activate/Deactivate button
- Pagination at the bottom

![Admin Customers](./screenshots/admin_customers.png)

---

### 21. Admin — Store Settings

**What you see:**
- "Save Settings" button in the header
- **General Info card** (left): Store Name, Tagline, Contact Email, Contact Phone inputs
- **Shipping & Tax card** (right): Shipping Fee, Free Shipping Above, Tax Rate inputs — with a blue hint box summarising the current configuration
- **Homepage Banners section**: "+ Add Banner" button, existing banner cards with image preview, title, subtitle, link, Active badge, Delete button. An inline form appears when adding a new banner.
- **Configured Categories section**: Read-only grid of category chips with icon, name, and Active/Inactive badge.

![Admin Settings](./screenshots/admin_settings.png)

---

## 🚀 Local Execution & Verification

To run PetPaws locally, follow these commands:

### 1. Start Backend Server
```bash
cd server
npm install
cp .env.example .env    # Fill in MONGO_URI and JWT_SECRET
npm run dev
```
Backend starts at: `http://localhost:8000`

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
Frontend starts at: `http://localhost:5173`

### 3. Seed the Database
```bash
cd server
npm run seed
```
Creates admin account, test user, 16 sample products, and sample order.

### 4. Verify API Health
```bash
curl http://localhost:8000/api/health
# Expected: { "status": "OK", "message": "PetPaws API is running" }
```

### 5. Log In
| Role | URL | Email | Password |
| :--- | :--- | :--- | :--- |
| Customer | http://localhost:5173/login | john@example.com | user123 |
| Admin | http://localhost:5173/login | admin@petpaws.com | admin123 |

---

[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
