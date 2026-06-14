# PetPaws MERN Stack — Project Architecture

This document serves as the central index for the **PetPaws Pet Foods & Accessories Store Architecture**. Click on the links below to view the detailed document for each architectural component.

---

## Architecture Sub-topics

### 1. [Technical Architecture](docs/technical_architecture.md)
- **Description**: End-to-end system design showing how the React SPA communicates with the Express.js REST API, how JWT authentication flows through middleware layers, how Mongoose models interact with MongoDB, and how external services (payments, images) are integrated.
- **File Path**: [docs/technical_architecture.md](docs/technical_architecture.md)

---

### 2. [Entity Relationship (ER) Diagram](docs/er_diagram.md)
- **Description**: High-level database schema showing all six MongoDB collections (User, Product, Order, Cart, Review, AdminSettings), their field definitions, and the relationships between them modelled via Mongoose ObjectId references.
- **File Path**: [docs/er_diagram.md](docs/er_diagram.md)

---

### 3. [E-Commerce Features](docs/features.md)
- **Description**: Complete specification of all customer-facing features (authentication, product browsing, cart, wishlist, checkout, order tracking, reviews) and all administrator features (product CRUD, order management, user management, dashboard analytics, store settings).
- **File Path**: [docs/features.md](docs/features.md)

---

### 4. [Roles and Responsibilities](docs/roles_responsibilities.md)
- **Description**: Role-Based Access Control (RBAC) matrix defining Guest, Registered User, and Administrator permissions. Covers JWT middleware design patterns (`protect` and `adminOnly`) with code-level examples.
- **File Path**: [docs/roles_responsibilities.md](docs/roles_responsibilities.md)

---

### 5. [User Flows](docs/user_flow.md)
- **Description**: Interactive sequence diagrams mapping the complete checkout lifecycle, order tracking flow, and admin order management flow between the React client, Express API, MongoDB, and payment processing steps.
- **File Path**: [docs/user_flow.md](docs/user_flow.md)

---

### 6. [MVC Pattern in MERN](docs/mvc_pattern.md)
- **Description**: Deep-dive on how the classic Model-View-Controller design pattern maps across the decoupled PetPaws MERN codebase — from React components (View) through Express routers and controllers (Controller) to Mongoose schemas (Model).
- **File Path**: [docs/mvc_pattern.md](docs/mvc_pattern.md)

---

### 7. [UI Walkthrough](docs/walkthrough.md)
- **Description**: Screenshot-by-screenshot walkthrough of every page in the PetPaws application, covering the customer storefront and the admin dashboard, with execution instructions.
- **File Path**: [docs/walkthrough.md](docs/walkthrough.md)

---

## High-Level System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        PetPaws System                        │
│                                                              │
│  ┌─────────────────┐        ┌─────────────────────────────┐ │
│  │   Client Layer  │        │       Server Layer          │ │
│  │                 │  HTTP  │                             │ │
│  │  React.js SPA   │◄──────►│  Node.js + Express.js API  │ │
│  │  (Vite / v18)   │  REST  │  JWT Auth + Middleware      │ │
│  │  Context API    │        │  Controllers + Routes       │ │
│  └─────────────────┘        └──────────────┬──────────────┘ │
│                                            │  Mongoose ODM  │
│                                            ▼                │
│                             ┌─────────────────────────────┐ │
│                             │       MongoDB Database       │ │
│                             │  Users · Products · Orders  │ │
│                             │  Cart · Reviews · Settings  │ │
│                             └─────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

[◄ Back to Home](README.md)
