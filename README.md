# 🍕 FoodieExpress — Frontend

> **CMJD — Comprehensive Master Java Developer**  
> Course Work · Batch 112 / 113 · Assignment 1  
> *Online Food Ordering System — Frontend*

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Environment & Proxy](#-environment--proxy)
6. [Pages & Routes](#-pages--routes)
7. [Authentication Flow](#-authentication-flow)
8. [State Management](#-state-management)
9. [API Layer](#-api-layer)
10. [Component Reference](#-component-reference)
11. [Admin Panel](#-admin-panel)
12. [Default Credentials](#-default-credentials)

---

## 🎯 Project Overview

FoodieExpress Frontend is a fully responsive **React + TypeScript** single-page application that connects to the Spring Boot backend API. It covers the complete customer and admin experience — from browsing the menu and managing a cart, through placing orders and making payments, to a full admin panel for managing the entire platform.

### Features at a glance

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Sign up / sign in with automatic token persistence and auto-logout on expiry |
| **Menu Browsing** | Browse all food items, filter by category, search by name |
| **Shopping Cart** | Add, update, remove items — live cart badge in the navbar |
| **Order Placement** | Place an order from the cart with a delivery address |
| **Payment** | Pay for an order with a transaction reference number |
| **Order Tracking** | View order history and live status badges |
| **User Profile** | View and edit personal details |
| **Admin Panel** | Full CRUD for food items and categories, order status management, user management |
| **Responsive Design** | Works on mobile, tablet, and desktop |
| **Toast Notifications** | Instant feedback for every user action |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI library |
| **TypeScript** | 5.7 | Type-safe JavaScript |
| **React Router** | v6.28 | Client-side routing |
| **Axios** | 1.7 | HTTP client with JWT interceptors |
| **Tailwind CSS** | v4.2 | Utility-first styling |
| **Lucide React** | 1.11 | Icon library |
| **Vite** | 6.2 | Dev server and build tool |
| **Google Fonts** | — | Outfit (body) + Playfair Display (headings) |

---

## 📁 Project Structure

```
src/
│
├── api/                         ← Backend connection (Axios)
│   ├── axiosInstance.ts         ← Base Axios instance + JWT interceptors
│   ├── authApi.ts               ← login, signup
│   ├── userApi.ts               ← getMe, getAll, deleteUser
│   ├── categoryApi.ts           ← getAll, create, update, delete
│   ├── foodApi.ts               ← getAll, create, update, delete
│   ├── cartApi.ts               ← get, addItem, updateItem, removeItem, clear
│   ├── orderApi.ts              ← place, getMy, getAll, updateStatus, cancel
│   └── paymentApi.ts            ← process, getByOrder
│
├── components/
│   ├── layout/                  ← Page-level layout wrappers
│   │   ├── Navbar.tsx           ← Sticky top nav with cart badge + user dropdown
│   │   ├── Footer.tsx           ← Site footer with quick links and contact
│   │   └── AdminLayout.tsx      ← Admin sidebar layout (collapsible)
│   │
│   └── ui/                      ← Reusable UI components
│       ├── Badge.tsx            ← Coloured status pill (success/error/warning/info)
│       ├── Loader.tsx           ← Spinning loader with optional message
│       ├── EmptyState.tsx       ← Empty list placeholder with emoji + action
│       ├── ProtectedRoute.tsx   ← Route guard (auth + admin role check)
│       ├── Modal.tsx            ← Accessible popup modal with backdrop
│       ├── StatCard.tsx         ← Admin dashboard stat card with icon + trend
│       ├── FoodCard.tsx         ← Menu item card with Add-to-Cart button
│       ├── CategoryFilter.tsx   ← Pill-button category selector
│       └── OrderCard.tsx        ← Order history card with expandable items + Pay Now
│
├── context/                     ← Global state (React Context)
│   ├── AuthContext.tsx          ← User session, login, logout
│   ├── CartContext.tsx          ← Cart state, add/update/remove/clear
│   └── ToastContext.tsx         ← App-wide toast notifications
│
├── data/
│   └── constants.ts             ← BASE_URL, DELIVERY_FEE, category emojis, FALLBACK_IMG
│
├── hooks/                       ← Custom data-fetching hooks
│   ├── useFoods.ts              ← Fetch foods + categories with filter/search support
│   ├── useOrders.ts             ← Fetch orders (customer or admin mode)
│   └── useAdminStats.ts         ← Fetch all 4 stats for admin dashboard
│
├── pages/
│   ├── HomePage.tsx             ← Hero, categories grid, featured items, features, CTA
│   ├── MenuPage.tsx             ← Food grid with search + category filter
│   ├── CartPage.tsx             ← Cart items, delivery address, order summary
│   ├── OrdersPage.tsx           ← Order history list + payment modal
│   ├── ProfilePage.tsx          ← User profile with inline editing
│   ├── SignInPage.tsx           ← Login form
│   ├── SignUpPage.tsx           ← Registration form (6 fields)
│   └── admin/
│       ├── AdminDashboard.tsx   ← Stats cards + quick links + recent orders table
│       ├── AdminFoodsPage.tsx   ← Food CRUD table with image preview modal
│       ├── AdminCategoriesPage.tsx ← Category CRUD card grid with emoji preview
│       ├── AdminOrdersPage.tsx  ← All orders table with status filter + update dropdown
│       └── AdminUsersPage.tsx   ← All users table with delete (non-admin only)
│
├── services/                    ← Frontend business logic helpers
│   ├── authService.ts           ← localStorage token persistence helpers
│   ├── cartService.ts           ← subtotal, delivery fee, total calculations
│   └── orderService.ts          ← canCancel() business rule
│
├── utils/                       ← Pure utility functions and type definitions
│   ├── types.ts                 ← All TypeScript interfaces matching backend DTOs
│   ├── formatters.ts            ← formatLKR(), formatDate(), truncate(), getInitials()
│   ├── validators.ts            ← isValidEmail(), isStrongPassword()
│   └── orderStatus.ts           ← Status → badge variant + emoji mappings
│
├── App.tsx                      ← Root component — BrowserRouter + all routes
├── main.tsx                     ← React app entry point
└── index.css                    ← Tailwind v4 + @theme tokens + custom utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or above
- **npm** 9 or above
- The **backend** running on `http://localhost:8080` (see backend README)

### 1 — Clone the repository

```bash
git clone https://github.com/Sadew-Upendra/foodorder-frontend.git
cd foodorder-frontend
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Start the development server

```bash
npm run dev
```

Opens at **http://localhost:5173**

### 4 — Build for production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy.

### 5 — Preview the production build locally

```bash
npm run preview
```

---

## 🌐 Environment & Proxy

There is **no `.env` file needed** for local development. The Vite dev server proxies all API calls automatically.

### How the proxy works

All requests that start with `/foodorder` are forwarded to the backend:

```
Browser → localhost:5173/foodorder/api/v1/foods
Vite proxy → localhost:8080/foodorder/api/v1/foods
Spring Boot → responds with JSON
Vite → passes response back to browser
```

This is configured in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/foodorder': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

> **Why this matters:** Without the proxy, the browser would make a cross-origin request directly to port 8080, which triggers CORS errors. The proxy makes every API call appear to come from the same origin (port 5173).

### For production deployment

Replace the Vite proxy with an **Nginx** reverse proxy rule:

```nginx
location /foodorder/ {
    proxy_pass http://localhost:8080/foodorder/;
}
```

---

## 🗺️ Pages & Routes

| Route | Access | Page | Description |
|-------|--------|------|-------------|
| `/` | Public | `HomePage` | Hero section, category grid, featured foods, features, CTA |
| `/menu` | Public | `MenuPage` | Full menu with search bar and category filter pills |
| `/signin` | Public | `SignInPage` | Email + password login form |
| `/signup` | Public | `SignUpPage` | Registration form (name, email, password, phone, address) |
| `/cart` | Auth | `CartPage` | Cart items + delivery address + order summary + place order |
| `/orders` | Auth | `OrdersPage` | Order history + cancel + Pay Now modal |
| `/profile` | Auth | `ProfilePage` | View and edit user profile details |
| `/admin` | Admin | `AdminDashboard` | Stats overview + quick links + recent orders |
| `/admin/foods` | Admin | `AdminFoodsPage` | CRUD food items with image preview |
| `/admin/categories` | Admin | `AdminCategoriesPage` | CRUD categories with emoji auto-detection |
| `/admin/orders` | Admin | `AdminOrdersPage` | All orders with status filter + update dropdown |
| `/admin/users` | Admin | `AdminUsersPage` | All users with safe delete (admins protected) |
| `/*` | — | — | Redirects to `/` |

### Route protection

```
ProtectedRoute (isAuthenticated check)
  └── if not logged in → redirect to /signin

ProtectedRoute adminOnly (isAdmin check)
  └── if not ADMIN role → redirect to /
```

---

## 🔐 Authentication Flow

### Sign In

```
1. User submits email + password on SignInPage
2. authApi.login() calls POST /foodorder/api/v1/auth/login
3. Backend returns JWTResponse { token, userId, email, name, role }
4. authService.persist() saves to localStorage:
      localStorage.setItem('token', '...')
      localStorage.setItem('user',  '{"name":"...", "role":"CUSTOMER", ...}')
5. AuthContext.setUser() updates React state
6. CartContext detects isAuthenticated=true → fetches cart from backend
7. Navbar updates: shows user name + cart badge + My Orders link
8. Navigate to /menu
```

### Token attached to every request

`axiosInstance.ts` uses a request interceptor:

```ts
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
```

### Auto-logout on expiry

If the backend returns HTTP 401, the response interceptor clears storage and redirects to sign in:

```ts
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/signin'
  }
  return Promise.reject(err)
})
```

### Session restore on page refresh

`AuthContext` reads from localStorage on mount — so refreshing the browser does not log the user out:

```ts
useEffect(() => {
  const stored = authService.getStoredUser()
  if (stored) setUser(stored)
  setLoading(false)
}, [])
```

---

## 🗃️ State Management

Three React contexts handle all shared state. They are layered in `App.tsx`:

```
ToastProvider       ← notifications (outermost — available everywhere)
  └── AuthProvider  ← user session
        └── CartProvider  ← shopping cart (depends on auth state)
```

### AuthContext

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `user` | `JWTResponse \| null` | The logged-in user, or `null` |
| `isAuthenticated` | `boolean` | `true` when `user !== null` |
| `isAdmin` | `boolean` | `true` when `user.role === 'ADMIN'` |
| `loading` | `boolean` | `true` during initial localStorage restore |
| `login(d)` | `async fn` | Calls API, persists token, updates state |
| `signUp(d)` | `async fn` | Registers, persists token, updates state |
| `logout()` | `fn` | Clears storage, resets state, redirects to `/` |

### CartContext

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `cart` | `CartResponse \| null` | Full cart from backend |
| `cartCount` | `number` | Total items (shown in Navbar badge) |
| `refresh()` | `async fn` | Refetches cart from backend |
| `addItem(d)` | `async fn` | Adds item; updates `cart` from response |
| `updateItem(id, qty)` | `async fn` | Changes quantity; updates `cart` |
| `removeItem(id)` | `async fn` | Removes item; updates `cart` |
| `clearCart()` | `async fn` | Clears all items |

### ToastContext

```ts
const { toast } = useToast()

toast('Item added to cart! 🛒',   'success')  // green
toast('Please sign in first',      'warning')  // yellow
toast('Failed to save item',       'error')    // red
toast('Cart refreshed',            'info')     // blue
```

Toasts appear in the bottom-right corner with a slide-in animation and auto-dismiss after 3.8 seconds.

---

## 🌐 API Layer

Every API file exports a plain object with async functions. All functions return the `data` field of the Axios response — you never handle `.then(r => r.data)` yourself in pages.

### Example — foodApi

```ts
// Fetch all foods (with optional filters)
const foods = await foodApi.getAll({ categoryId: 'CAT-xxx' })
const foods = await foodApi.getAll({ search: 'burger' })
const foods = await foodApi.getAll()

// Create (ADMIN only)
const newFood = await foodApi.create({ name: 'Margherita', price: 950, ... })

// Update (ADMIN only)
const updated = await foodApi.update('FOOD-xxx', { price: 1100, ... })

// Delete (ADMIN only)
await foodApi.delete('FOOD-xxx')
```

### Request / Response types

All request and response shapes are defined in `src/utils/types.ts` and match the backend DTOs exactly:

| Interface | Direction | Usage |
|-----------|-----------|-------|
| `LoginDto` | Request | Sign in credentials |
| `SignUpDto` | Request | Registration form data |
| `JWTResponse` | Response | Auth response with token + user info |
| `FoodItemRequest` | Request | Create / update food item |
| `FoodItemResponse` | Response | Food item returned from API |
| `CartItemRequest` | Request | Add item to cart |
| `CartResponse` | Response | Full cart with items + total |
| `OrderRequest` | Request | Place order (delivery address) |
| `OrderResponse` | Response | Order with items + status + payment |
| `PaymentRequest` | Request | Process payment (orderId + txnId) |
| `PaymentResponse` | Response | Payment record |

---

## 🧩 Component Reference

### UI Components

#### `<Badge label="" variant="" />`

Renders a coloured pill label. Used for order status, payment status, and user roles.

```tsx
<Badge label="DELIVERED" variant="success" />   // green
<Badge label="CANCELLED" variant="error" />     // red
<Badge label="PREPARING" variant="warning" />   // yellow
<Badge label="PLACED"    variant="info" />      // blue
<Badge label="ADMIN"     variant="warning" />
```

#### `<Loader message="" fullPage />`

```tsx
<Loader />                             // centred spinner in a section
<Loader message="Loading orders…" />   // custom message
<Loader fullPage />                    // min-h-screen for page-level loading
```

#### `<EmptyState emoji="" title="" desc="" action={} />`

```tsx
<EmptyState
  emoji="📦"
  title="No orders yet"
  desc="Start ordering your favourite food!"
  action={<Link to="/menu">Browse Menu</Link>}
/>
```

#### `<Modal open title="" onClose={} maxW="" />`

```tsx
<Modal open={showModal} title="Add Food Item" onClose={() => setShowModal(false)}>
  <form>...</form>
</Modal>
```

#### `<ProtectedRoute adminOnly />`

```tsx
<ProtectedRoute>              {/* any logged-in user */}
  <CartPage />
</ProtectedRoute>

<ProtectedRoute adminOnly>    {/* ADMIN role only */}
  <AdminDashboard />
</ProtectedRoute>
```

#### `<FoodCard food={} />`

Renders a menu item card. Handles the Add-to-Cart action including loading and success states. Shows a warning toast for guests who aren't signed in.

#### `<OrderCard order={} onCancel={} onPay={} />`

Expandable order card showing status badge, date, address, item list, and payment status. Shows Cancel and Pay Now buttons based on order state.

---

## 🔧 Admin Panel

The admin panel uses a completely different layout (`AdminLayout`) with a collapsible sidebar — no Navbar or Footer.

### Accessing the admin panel

1. Log in with an admin account (see [Default Credentials](#-default-credentials))
2. Click **Admin Panel** in the user dropdown, or navigate to `/admin`

### Admin sidebar navigation

| Link | Page | What you can do |
|------|------|-----------------|
| Dashboard | `/admin` | View platform stats and recent orders |
| Food Items | `/admin/foods` | Add, edit, delete food items |
| Categories | `/admin/categories` | Add, edit, delete categories |
| Orders | `/admin/orders` | View all orders, update status |
| Users | `/admin/users` | View all users, delete customer accounts |

### Order status management

In **Admin → Orders**, use the dropdown in the Update column to move orders through their lifecycle:

```
PLACED  →  PREPARING  →  DELIVERED
```

> Orders with `DELIVERED` or `CANCELLED` status have the dropdown disabled — those states are final.

### Sidebar collapse

Click the red circle button on the right edge of the sidebar to toggle between full-width (256 px) and icon-only (72 px) mode. State is preserved while navigating between admin pages.

---

## 🎨 Design System

### Colour palette

| Token | Hex | Used for |
|-------|-----|----------|
| Primary | `#ff4757` | Buttons, active states, borders, cart badge |
| Primary Dark | `#e84118` | Button hover state |
| Dark | `#2f3542` | Body text, navbar, admin sidebar |
| Accent | `#ffa502` | Category badges on food cards |
| Page BG | `#f1f2f6` | Background of all pages |

### Typography

| Font | Weight | Used for |
|------|--------|---------|
| **Outfit** | 400 – 800 | All body text, labels, buttons, nav |
| **Playfair Display** | 700 – 800 | Page headings (`.font-serif` class) |

### Spacing / Shape

| Class | Radius | Used for |
|-------|--------|---------|
| `rounded-xl` | 12 px | Inputs, small buttons |
| `rounded-2xl` | 16 px | Cards, panels |
| `rounded-3xl` | 24 px | Modals, auth card |
| `rounded-full` | 9999 px | Badges, avatar circles, pill buttons |

---

## 🔑 Default Credentials

The backend seeds a default admin account on first startup.  
Use these to log in and access the admin panel:

| Field | Value |
|-------|-------|
| **Email** | `admin@foodorder.lk` |
| **Password** | `Admin@1234` |
| **Role** | `ADMIN` |

> For customer access — register a new account at `/signup`.

---

## 📄 License

This project is developed for educational purposes as part of the **CMJD — Comprehensive Master Java Developer** programme at **IJSE**, Sri Lanka.

---

<div align="center">
  Built with using React · TypeScript · Tailwind CSS · Vite
  <br/>
  Developed by Sadew Upendra
</div>