# User Flows

This document maps out the key user journeys on the **PetPaws** e-commerce platform using sequence diagrams — covering the complete checkout lifecycle, order tracking, and administrator order management.

---

## 1. Customer Checkout Flow

This diagram outlines the complete sequence from a user adding a pet product to the cart through to successful order confirmation.

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App
    participant AuthCtx as AuthContext
    participant Backend as Node/Express API
    participant DB as MongoDB

    User->>Frontend: Click "Add to Cart" on product
    Frontend->>AuthCtx: Check if user is logged in
    AuthCtx-->>Frontend: User authenticated (JWT present)
    Frontend->>Backend: POST /api/cart { productId, quantity }
    Backend->>DB: Find or create Cart for user
    Backend->>DB: Check Product stock
    DB-->>Backend: Stock available
    Backend->>DB: Add item to Cart document
    DB-->>Backend: Updated cart
    Backend-->>Frontend: { success: true, cart }
    Frontend->>User: Cart badge updates (+1), Toast "Added to cart 🛒"

    User->>Frontend: Click "Proceed to Checkout"
    Frontend->>AuthCtx: Confirm user session
    Frontend->>User: Display Step 1 — Shipping Address
    User->>Frontend: Select saved address or fill new address form
    User->>Frontend: Click "Continue to Payment"
    Frontend->>User: Display Step 2 — Payment Method
    User->>Frontend: Select payment method (COD / Card / UPI)
    User->>Frontend: Click "Review Order"
    Frontend->>User: Display Step 3 — Full order review

    User->>Frontend: Click "Place Order"
    Frontend->>Backend: POST /api/orders { shippingAddress, paymentMethod, orderItems }
    Backend->>DB: Validate stock for every item
    DB-->>Backend: All items in stock
    Backend->>DB: Create Order document (status: Pending)
    Backend->>DB: Decrement stock, increment soldCount per product
    Backend->>DB: Clear user's Cart
    DB-->>Backend: Order created, cart cleared
    Backend-->>Frontend: { success: true, order }
    Frontend->>User: Redirect to /order-confirmation/:id
    Frontend->>User: Display Order ID, items list, total
```

---

## 2. User Registration & Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App
    participant Backend as Node/Express API
    participant DB as MongoDB

    User->>Frontend: Fill registration form (name, email, password)
    Frontend->>Backend: POST /api/auth/register
    Backend->>DB: Check if email already exists
    DB-->>Backend: Email is unique
    Backend->>DB: Hash password (bcrypt, 10 rounds)
    Backend->>DB: Create User document
    DB-->>Backend: User created
    Backend-->>Frontend: { token, user }
    Frontend->>Frontend: Store JWT in localStorage
    Frontend->>Frontend: Update AuthContext (user state)
    Frontend->>User: Redirect to homepage with welcome toast

    Note over User, DB: --- Later, on return visit ---

    User->>Frontend: Fill login form (email, password)
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Find user by email (select +password)
    DB-->>Backend: User found
    Backend->>Backend: bcrypt.compare(inputPassword, storedHash)
    Backend-->>Frontend: { token, user }
    Frontend->>Frontend: Store JWT in localStorage
    Frontend->>User: Redirect to previous page or homepage
```

---

## 3. Order Tracking Flow (Customer)

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App
    participant Backend as Node/Express API
    participant DB as MongoDB

    User->>Frontend: Navigate to /orders
    Frontend->>Backend: GET /api/orders/my
    Backend->>DB: Find all Orders where user = req.user._id
    DB-->>Backend: Array of orders (sorted newest first)
    Backend-->>Frontend: { orders, total, pages }
    Frontend->>User: Display order list with status badges

    User->>Frontend: Click on an order
    Frontend->>Backend: GET /api/orders/:id
    Backend->>DB: Find Order by _id
    Backend->>Backend: Verify order.user === req.user._id
    DB-->>Backend: Full order document
    Backend-->>Frontend: { order }
    Frontend->>User: Display full order detail page

    Frontend->>User: Show visual status timeline
    Note over Frontend, User: Pending ✓ Confirmed ✓ Processing ✓ Shipped ... Delivered

    alt Order is Pending or Confirmed
        User->>Frontend: Click "Cancel Order"
        Frontend->>Backend: PUT /api/orders/:id/cancel { reason }
        Backend->>DB: Set orderStatus = 'Cancelled', push statusHistory
        Backend->>DB: Restore stock per item (increment stock, decrement soldCount)
        DB-->>Backend: Order cancelled
        Backend-->>Frontend: { success: true, order }
        Frontend->>User: Status badge updates to "Cancelled"
    end
```

---

## 4. Admin Order Management Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend as Admin Panel
    participant Backend as Node/Express API
    participant DB as MongoDB

    Admin->>Frontend: Navigate to /admin/orders
    Frontend->>Backend: GET /api/orders (with protect + adminOnly)
    Backend->>DB: Find all Orders, populate user (name, email)
    DB-->>Backend: All orders sorted by createdAt desc
    Backend-->>Frontend: { orders, total, pages }
    Frontend->>Admin: Display orders table with status tabs

    Admin->>Frontend: Click "View" on an order
    Frontend->>Backend: GET /api/orders/:id
    DB-->>Backend: Full order with populated user
    Backend-->>Frontend: { order }
    Frontend->>Admin: Display order detail with status update form

    Admin->>Frontend: Select new status (e.g., "Shipped")
    Admin->>Frontend: Enter tracking number "BD123456789"
    Admin->>Frontend: Enter note "Dispatched via BlueDart"
    Admin->>Frontend: Click "Update Status"
    Frontend->>Backend: PUT /api/orders/:id/status { status, trackingNumber, note }
    Backend->>DB: Set orderStatus, push to statusHistory, set trackingNumber
    DB-->>Backend: Updated order
    Backend-->>Frontend: { success: true, order }
    Frontend->>Admin: Status badge updates, history timeline appends new entry
```

---

## 5. Admin Product Creation Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend as Admin Panel
    participant Backend as Node/Express API
    participant DB as MongoDB

    Admin->>Frontend: Navigate to /admin/products/new
    Admin->>Frontend: Fill product form (name, desc, price, discount, stock, category, petType, images, tags)
    Admin->>Frontend: Toggle "Featured Product" checkbox
    Admin->>Frontend: Click "Create Product"
    Frontend->>Backend: POST /api/products (with protect + adminOnly)
    Backend->>Backend: Validate required fields
    Backend->>DB: Create Product document
    Backend->>DB: pre('save') hook computes discountedPrice
    DB-->>Backend: Product created
    Backend-->>Frontend: { success: true, product }
    Frontend->>Admin: Redirect to /admin/products with success toast
    Frontend->>Admin: New product appears in the table
```

---

## 6. Product Review Submission Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App
    participant Backend as Node/Express API
    participant DB as MongoDB

    User->>Frontend: Navigate to product detail page
    Frontend->>Frontend: Check AuthContext — user is logged in
    Frontend->>User: Show review form (rating stars, title, comment)

    User->>Frontend: Select 5 stars, enter title and comment
    User->>Frontend: Click "Submit Review"
    Frontend->>Backend: POST /api/reviews { productId, rating, title, comment }
    Backend->>DB: Check for existing review (user + product unique index)
    DB-->>Backend: No existing review
    Backend->>DB: Check for delivered order containing this product (verified purchase check)
    DB-->>Backend: Delivered order found → isVerifiedPurchase = true
    Backend->>DB: Create Review document
    Backend->>DB: Recalculate all reviews for product
    Backend->>DB: Update product ratings.average and ratings.count
    DB-->>Backend: Review saved, product ratings updated
    Backend-->>Frontend: { success: true, review }
    Frontend->>User: New review appears at top of review list with "Verified Purchase" badge
```

---

[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
