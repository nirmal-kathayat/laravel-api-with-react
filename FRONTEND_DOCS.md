# Lumora Frontend — Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Project Structure](#3-project-structure)
4. [React Flow — Full Walkthrough](#4-react-flow--full-walkthrough)
   - [Entry Point](#41-entry-point)
   - [Routing (App.jsx)](#42-routing-appjsx)
   - [Theme System](#43-theme-system)
   - [Static Data Layer](#44-static-data-layer)
   - [Custom Hooks](#45-custom-hooks)
   - [Components — Page by Page](#46-components--page-by-page)
   - [Auth Pages](#47-auth-pages)
   - [Styling Approach](#48-styling-approach)
5. [Backend API Integration — Learning Path](#5-backend-api-integration--learning-path)
   - [Step 1 — Set Up an API Client](#step-1--set-up-an-api-client)
   - [Step 2 — Global Auth State with Context](#step-2--global-auth-state-with-context)
   - [Step 3 — Protect Routes](#step-3--protect-routes)
   - [Step 4 — Wire Login & Signup Forms](#step-4--wire-login--signup-forms)
   - [Step 5 — Replace Static Data with Real API Calls](#step-5--replace-static-data-with-real-api-calls)
   - [Step 6 — Cart & Wishlist State](#step-6--cart--wishlist-state)
   - [Step 7 — Newsletter Subscription](#step-7--newsletter-subscription)
   - [Step 8 — Loading & Error States](#step-8--loading--error-states)
   - [Module-by-Module API Map](#module-by-module-api-map)
6. [Best Practices Summary](#6-best-practices-summary)

---

## 1. Project Overview

**Lumora** is a modern e-commerce homepage built with React + Vite. It is a pure frontend SPA (Single Page Application) with:

- A full homepage (announcement bar → navbar → hero → categories → best sellers → flash sale → new arrivals → trust badges → testimonials → newsletter → footer)
- A `/login` page
- A `/signup` page

All data is currently **static** (hardcoded in `src/data.jsx`). The backend integration will replace this static data with real API calls.

---

## 2. Tech Stack & Tooling

| Tool | Purpose |
|---|---|
| **React 18** | UI component library |
| **Vite 5** | Dev server + bundler (fast HMR) |
| **react-router-dom v6** | Client-side routing |
| **Inline styles + CSS classes** | Styling (no Tailwind, no CSS modules) |
| **IntersectionObserver API** | Scroll-reveal animations |
| Node / npm | Package management |

No state management library (Redux, Zustand) yet — currently only local `useState`. That will change when the backend is wired.

---

## 3. Project Structure

```
homepage_frontend/
├── index.html                  # HTML shell — mounts <div id="root">
├── vite.config.js              # Vite configuration
├── package.json
└── src/
    ├── main.jsx                # React entry — renders <App /> into #root
    ├── App.jsx                 # Router — defines all routes
    ├── index.css               # Global CSS (animations, hover, reveal)
    ├── theme.js                # Design tokens (colors, fonts, layout helpers)
    ├── data.jsx                # Static data (products, categories, testimonials…)
    ├── hooks/
    │   ├── useReveal.js        # Scroll-reveal via IntersectionObserver
    │   └── useCountdown.js     # Live countdown timer for Flash Sale
    ├── pages/
    │   ├── Login.jsx           # /login route
    │   └── Signup.jsx          # /signup route
    └── components/
        ├── AnnouncementBar.jsx
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Categories.jsx
        ├── CategoryCard.jsx
        ├── BestSellers.jsx
        ├── ProductCard.jsx
        ├── FlashSale.jsx
        ├── NewArrivals.jsx
        ├── TrustBadges.jsx
        ├── Testimonials.jsx
        ├── Newsletter.jsx
        ├── Footer.jsx
        ├── Reveal.jsx          # Scroll-reveal wrapper
        └── common/
            ├── Icons.jsx       # All inline SVG icons
            ├── Logo.jsx        # Lumora wordmark
            ├── ProductImage.jsx
            └── SectionHeader.jsx
```

---

## 4. React Flow — Full Walkthrough

### 4.1 Entry Point

**`index.html`** contains a single `<div id="root">`. Vite loads `src/main.jsx` as a module.

**`src/main.jsx`** is the React bootstrap:

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

`React.StrictMode` enables extra developer warnings (double-invokes effects in dev, warns about deprecated APIs). It has no effect in production.

---

### 4.2 Routing (App.jsx)

`App.jsx` is the **router shell**. It uses `BrowserRouter` (HTML5 history API — no `#` in URLs) and defines three routes:

```
/          →  <Home />    (the full homepage)
/login     →  <Login />
/signup    →  <Signup />
```

The `<Home />` component is defined inline inside `App.jsx` and simply stacks every homepage section in order. This keeps the homepage as a simple composition of independent section components.

**How navigation works:**
- The `<Navbar>` has an `Account` button wrapped in a `<Link to="/login">` — clicking it navigates to the login page.
- `Login.jsx` has a `<Link to="/signup">` and vice versa — they link between each other.
- Both auth pages have a `<Link to="/">` on the logo to go back home.
- `BrowserRouter` intercepts these link clicks and swaps the rendered route without a full page reload.

---

### 4.3 Theme System

**`src/theme.js`** is the single source of truth for all design decisions. Every component imports from it instead of hardcoding values.

```js
colors    // palette — bg, ink, brand (#FF6B35), amber, etc.
fonts     // Bricolage Grotesque (display/headings), Manrope (body)
layout    // maxWidth: 1280, gutter: 24
dottedBg  // helper for the diagonal dotted pattern in Hero
sectionStyle // helper that returns { maxWidth, margin, padding } for section containers
```

**Why this matters for API integration:** When you add loading skeletons or error states, import from `theme.js` so they match the existing visual style automatically.

---

### 4.4 Static Data Layer

**`src/data.jsx`** holds all content that will eventually come from the backend:

| Export | Used in | Will become |
|---|---|---|
| `heroImage` | `Hero` | CMS or S3 URL from API |
| `categories` | `Categories` | `GET /api/categories` |
| `bestSellers` | `BestSellers` | `GET /api/products?sort=bestseller` |
| `newArrivals` | `NewArrivals` | `GET /api/products?sort=newest` |
| `trust` | `TrustBadges` | Static (config) |
| `testimonials` | `Testimonials` | `GET /api/reviews?featured=true` |
| `footerColumns`, `socials`, `payments` | `Footer` | Static (config) |

Each item in `bestSellers` and `newArrivals` has the shape:
```js
{ name, cat, price, oldPrice, rating, reviews, badge, img }
```
This shape should match what the API returns (or be mapped from the API response).

---

### 4.5 Custom Hooks

#### `useReveal` — Scroll Animation

```
hooks/useReveal.js
```

Uses the browser's `IntersectionObserver` to watch when an element enters the viewport. Returns `[ref, visible]`. When `visible` becomes `true`, the `.reveal` CSS class transitions from `opacity: 0 + translateY(26px)` to fully visible.

- `threshold: 0.12` — triggers when 12% of the element is visible
- `rootMargin: '0px 0px -40px 0px'` — starts slightly before the element fully enters
- Fires **once** (unobserves after first trigger) — elements don't hide again on scroll up

The `<Reveal>` component wraps this hook into a reusable `<div>`.

#### `useCountdown` — Flash Sale Timer

```
hooks/useCountdown.js
```

Calculates an end timestamp on mount (`Date.now() + duration`) and ticks every second via `setInterval`. Returns `{ days, hours, mins, secs }` as zero-padded strings (e.g. `"03"`, `"07"`). Cleans up the interval on unmount via the `useEffect` return function.

**FlashSale** passes `saleHours` and `saleMinutes` as props → App.jsx controls the sale duration from above.

---

### 4.6 Components — Page by Page

#### AnnouncementBar

- Purely presentational. Static text: free shipping offer, returns policy, members discount.
- One animated `pulseDot` CSS keyframe on the orange dot.
- **Future:** fetch active promotions from `GET /api/promotions/active`.

---

#### Navbar

Props: `cartCount` (number, defaults to 3)

Layout (left to right):
1. Logo → `<Link to="/">`
2. Search input (uncontrolled, no state — will need `useState` + API)
3. Nav links: Categories, Deals (anchor links to `#categories`, `#deals`)
4. Icon buttons: Wishlist heart, Cart (with badge count), Account (`<Link to="/login">`)

The cart badge reads from the `cartCount` prop. When you add a cart context, this prop will be replaced by a context value.

---

#### Hero

State: `heroFailed` (boolean) — falls back to a placeholder label if the image URL fails to load (`onError` handler).

Structure (CSS grid, `auto-fit minmax(340px, 1fr)`):
- **Left column** — eyebrow badge, H1 headline, description, two CTA buttons, three stats
- **Right column** — image panel with three floating cards (discount badge, delivery card, rating card)

The floating cards use `floaty` / `floatyB` CSS keyframe animations defined in `index.css`.

Stats (`50k+`, `4.9★`, `2k+`) are static. **Future:** fetch from `GET /api/stats`.

---

#### Categories

Renders a responsive grid of `<CategoryCard>` components from the `categories` array in `data.jsx`.

Each `CategoryCard` displays: emoji icon, category name, item count. It is wrapped in `<Reveal>` for scroll animation.

**Future:** replace `categories` import with data fetched from `GET /api/categories`.

---

#### BestSellers

Renders a responsive grid of `<ProductCard>` components from `bestSellers` in `data.jsx`. Each card is wrapped in both `<Reveal>` and a styled `<div>` (white card, border, shadow).

`ProductCard` displays: product image, badge (e.g. "Bestseller", "-26%"), wishlist button, category, name, rating, price (with optional strikethrough old price), add-to-cart button.

---

#### FlashSale

Receives `saleHours` and `saleMinutes` as props from `App.jsx`. Internally calls `useCountdown(saleHours, saleMinutes)` to derive the live `{ days, hours, mins, secs }` display.

Layout (grid): copy + CTA on the left, countdown boxes on the right. Dark `colors.ink` background with orange/amber radial gradient blobs as decorative elements.

**Future:** fetch active sale details (end time, discount) from `GET /api/sales/active` and pass the real end timestamp to the countdown.

---

#### NewArrivals

Same pattern as BestSellers but uses the `newArrivals` array. Uses an `ArrivalCard` sub-component (local to the file) with a 4:5 aspect ratio image and a "NEW" badge.

---

#### TrustBadges

Renders a 4-column grid of icon + title + subtitle items. The four icons (`Truck`, `Shield`, `Refresh`, `Headset`) are imported from `common/Icons.jsx`. Data comes from the `trust` array in `data.jsx`.

This section is likely to remain **static** (it represents brand promises, not dynamic data).

---

#### Testimonials

Renders a 3-column grid of review cards from the `testimonials` array. Each card: star rating, quote text, avatar (initials in a tinted circle), reviewer name and role.

**Future:** fetch from `GET /api/reviews?featured=true&limit=3`.

---

#### Newsletter

Contains a `<form>` with an email input and Subscribe button. Currently `onSubmit` just calls `e.preventDefault()` — a no-op stub.

**Future:** on submit, `POST /api/newsletter/subscribe` with `{ email }`.

---

#### Footer

Renders:
1. Brand column — Logo (dark variant), tagline, social icon links
2. Three link columns (Shop, Company, Support) from `footerColumns`
3. Bottom bar — copyright text, payment method badges

All links are `href="#"` placeholders. Social and payment data comes from `data.jsx`.

---

#### Reveal (utility component)

A thin wrapper that accepts `children`, `style`, `className`, and any other props, attaches `useReveal`'s ref, and applies `.reveal` / `.is-visible` CSS classes. The CSS transition lives in `index.css`. Used by most section-level components.

---

#### Common Components

| Component | Purpose |
|---|---|
| `Icons.jsx` | ~12 inline SVG icons as named exports. Accept `size` and `color` props. |
| `Logo.jsx` | Lumora wordmark. Accepts `dark` prop to invert colors for the dark footer. |
| `ProductImage.jsx` | Renders a product image inside a styled container. Handles the dotted placeholder when `src` is missing. Accepts `aspectRatio`, `radius`, `border` props. |
| `SectionHeader.jsx` | Reusable eyebrow + title + "View all" link header used by Categories, BestSellers, NewArrivals. |

---

### 4.7 Auth Pages

Both pages live in `src/pages/` and follow identical structural patterns.

#### Login (`/login`)

State:
- `showPass` (boolean) — toggles password field type between `password` and `text`
- `form` (`{ email, password }`) — controlled form state

Flow:
1. User fills email + password
2. `handleSubmit` fires `e.preventDefault()` — **stub, no API call yet**
3. `<Eye>` icon button toggles password visibility
4. "Forgot password?" is a static `<a href="#">` — needs its own route/modal later
5. Google OAuth button is **UI only** — needs OAuth flow wired

Links: Logo → `/`, Sign up → `/signup`

#### Signup (`/signup`)

State:
- `showPass` / `showConfirm` — independent toggles for password and confirm fields
- `agreed` (boolean) — terms checkbox; Submit button is `disabled` and dimmed when `false`
- `form` (`{ name, email, password, confirm }`) — controlled form state

Flow:
1. User fills all fields and checks the Terms checkbox
2. Submit button becomes enabled
3. `handleSubmit` fires `e.preventDefault()` — **stub, no API call yet**

Links: Logo → `/`, Sign in → `/login`

**Both forms use the same `inputStyle` and `primaryBtn` constant objects** — defined at the bottom of each file. This is the same inline-style pattern used throughout the project.

---

### 4.8 Styling Approach

The project uses a **hybrid styling strategy**:

| Technique | Used for |
|---|---|
| Inline `style={{ }}` | All layout, spacing, colors, typography — everything derivable from `theme.js` |
| CSS classes in `index.css` | Pseudo-states (`:hover`), CSS `@keyframes` animations, scroll-reveal transitions |
| No CSS modules / Tailwind | Intentional — keeps component styles co-located and portable |

**Why this pattern:** Inline styles make components self-contained (you can read and understand a component's look just from its JSX). CSS classes handle the things inline styles cannot: hover effects, animations, transitions.

---

## 5. Backend API Integration — Learning Path

This section is a step-by-step guide to progressively replacing static data with real backend API calls. The backend is a **Laravel REST API**.

### Step 1 — Set Up an API Client

Before touching any component, create a single Axios (or fetch-based) client file. This is where your base URL, auth token header injection, and error interceptors live.

**Install Axios:**
```bash
npm install axios
```

**Create `src/api/client.js`:**
```js
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:8000/api
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

// Attach token on every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client
```

**Create `.env.local`** (never commit this):
```
VITE_API_URL=http://localhost:8000/api
```

Vite exposes any variable prefixed with `VITE_` to the frontend via `import.meta.env`.

---

### Step 2 — Global Auth State with Context

Currently, auth state is nowhere — there is no concept of a logged-in user. Add a React Context so any component can know if the user is logged in.

**Create `src/context/AuthContext.jsx`:**
```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)        // null = not logged in
  const [token, setToken] = useState(
    () => localStorage.getItem('token') ?? null  // persist across refresh
  )

  const login = (userData, accessToken) => {
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

**Wrap your app in `main.jsx`:**
```jsx
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
```

Now any component can call `const { user, login, logout } = useAuth()`.

---

### Step 3 — Protect Routes

Some routes (e.g. `/profile`, `/orders`) should only be accessible when logged in. Create a `PrivateRoute` wrapper.

**Create `src/components/PrivateRoute.jsx`:**
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}
```

**Use it in `App.jsx`:**
```jsx
<Route path="/profile" element={
  <PrivateRoute><Profile /></PrivateRoute>
} />
```

---

### Step 4 — Wire Login & Signup Forms

This is the first real API call. Open `src/pages/Login.jsx` and replace the `handleSubmit` stub.

**Create `src/api/auth.js`:**
```js
import client from './client'

export const loginUser   = (data) => client.post('/auth/login', data)
export const registerUser = (data) => client.post('/auth/register', data)
export const logoutUser  = () => client.post('/auth/logout')
export const getMe       = () => client.get('/auth/me')
```

**Update `Login.jsx` `handleSubmit`:**
```jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/auth'

// inside the component:
const navigate = useNavigate()
const { login } = useAuth()
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    const res = await loginUser({ email: form.email, password: form.password })
    login(res.data.user, res.data.token)  // store in context + localStorage
    navigate('/')                          // redirect home
  } catch (err) {
    setError(err.response?.data?.message ?? 'Login failed. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

Add error display in the JSX above the Submit button:
```jsx
{error && (
  <p style={{ color: '#EF4444', fontSize: 13, margin: 0 }}>{error}</p>
)}
```

Disable the button while loading:
```jsx
<button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
  {loading ? 'Signing in…' : 'Sign in'}
</button>
```

Apply the **same pattern to `Signup.jsx`**, calling `registerUser` instead. After successful registration either auto-login the user or redirect to `/login` with a success message.

---

### Step 5 — Replace Static Data with Real API Calls

The cleanest React pattern for data fetching is a custom hook per resource. This keeps components clean and makes loading/error handling reusable.

**Create `src/hooks/useProducts.js`:**
```js
import { useEffect, useState } from 'react'
import client from '../api/client'

export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    client.get('/products', { params })
      .then((res) => setProducts(res.data.data))   // Laravel pagination: res.data.data
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])  // re-fetch when params change

  return { products, loading, error }
}
```

**Update `BestSellers.jsx`:**
```jsx
// Before (static):
import { bestSellers } from '../data.jsx'

// After (dynamic):
import { useProducts } from '../hooks/useProducts'

export default function BestSellers() {
  const { products, loading } = useProducts({ sort: 'bestseller', limit: 8 })
  // replace `bestSellers` with `products` everywhere in the JSX
}
```

Apply the same pattern for `Categories`, `NewArrivals`, and `Testimonials`.

---

### Step 6 — Cart & Wishlist State

The Navbar currently shows a hardcoded `cartCount={3}`. Replace this with real state.

**Create `src/context/CartContext.jsx`:**
```jsx
import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, action.item]
    case 'REMOVE': return state.filter(i => i.id !== action.id)
    case 'CLEAR':  return []
    default:       return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const add    = (item) => dispatch({ type: 'ADD', item })
  const remove = (id)   => dispatch({ type: 'REMOVE', id })
  const clear  = ()     => dispatch({ type: 'CLEAR' })
  return (
    <CartContext.Provider value={{ items, count: items.length, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

In `Navbar.jsx`, replace `cartCount` prop with `const { count } = useCart()`.

In `ProductCard.jsx`, connect the "Add to cart" button:
```jsx
const { add } = useCart()
// in the button onClick:
add({ id: product.id, name, price, img })
```

---

### Step 7 — Newsletter Subscription

Open `Newsletter.jsx` and replace the `onSubmit` stub:

```jsx
import { useState } from 'react'
import client from '../api/client'

// inside the component:
const [email, setEmail] = useState('')
const [status, setStatus] = useState('idle')   // 'idle' | 'loading' | 'success' | 'error'

const handleSubmit = async (e) => {
  e.preventDefault()
  setStatus('loading')
  try {
    await client.post('/newsletter/subscribe', { email })
    setStatus('success')
    setEmail('')
  } catch {
    setStatus('error')
  }
}
```

Show feedback messages below the form:
```jsx
{status === 'success' && <p style={{ color: '#fff', marginTop: 12 }}>You're in! Check your inbox.</p>}
{status === 'error'   && <p style={{ color: '#FFD166', marginTop: 12 }}>Something went wrong. Try again.</p>}
```

---

### Step 8 — Loading & Error States

When API calls are in-flight, show skeleton loaders instead of empty space. Here is the minimal pattern:

**Create `src/components/common/Skeleton.jsx`:**
```jsx
export default function Skeleton({ width = '100%', height = 20, radius = 8 }) {
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #E2E8F0 25%, #EDF1F6 50%, #E2E8F0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}
```

Add the shimmer keyframe to `index.css`:
```css
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

In `BestSellers.jsx` (for example):
```jsx
if (loading) return (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 22 }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} height={340} radius={22} />
    ))}
  </div>
)
```

---

### Module-by-Module API Map

Here is every frontend module mapped to the backend API endpoint it will need:

| Frontend Module | HTTP Method | Endpoint | Notes |
|---|---|---|---|
| **Login form** | `POST` | `/api/auth/login` | Returns `{ user, token }` |
| **Signup form** | `POST` | `/api/auth/register` | Returns `{ user, token }` or redirect to login |
| **Logout** | `POST` | `/api/auth/logout` | Revokes token (Laravel Sanctum) |
| **Get logged-in user** | `GET` | `/api/auth/me` | Hydrate user on page refresh |
| **Announcement bar** | `GET` | `/api/promotions/active` | List of active promotion strings |
| **Hero stats** | `GET` | `/api/stats` | `{ customers, rating, products }` |
| **Categories** | `GET` | `/api/categories` | `[{ id, name, count, icon, tint }]` |
| **Best Sellers** | `GET` | `/api/products?sort=bestseller&limit=8` | Paginated product list |
| **New Arrivals** | `GET` | `/api/products?sort=newest&limit=4` | Paginated product list |
| **Flash Sale** | `GET` | `/api/sales/active` | `{ endsAt, discountPercent }` |
| **Testimonials** | `GET` | `/api/reviews?featured=true&limit=3` | Featured review list |
| **Newsletter** | `POST` | `/api/newsletter/subscribe` | `{ email }` |
| **Add to cart** | `POST` | `/api/cart/items` | `{ product_id, quantity }` — or manage client-side and sync on checkout |
| **Wishlist** | `POST` | `/api/wishlist/items` | `{ product_id }` |
| **Search** | `GET` | `/api/products/search?q=...` | Triggered from Navbar search input |

---

## 6. Best Practices Summary

| Practice | Why |
|---|---|
| **One API client file** (`src/api/client.js`) | Single place to set base URL, token injection, error interceptors |
| **Custom hooks for data fetching** (`useProducts`, `useCategories`) | Keeps components clean; loading/error logic is reusable |
| **Context for global state** (`AuthContext`, `CartContext`) | Avoids prop-drilling `user` and `cartCount` through every component |
| **Never store sensitive data beyond `localStorage`** | For a production app, prefer `httpOnly` cookies for tokens (protects against XSS) |
| **`async/await` with `try/catch`** | Cleaner than `.then().catch()` chains; easier to read and handle loading state |
| **Show loading skeletons** | Prevents layout shift; feels faster than a blank screen |
| **`.env.local` for API URL** | Never hardcode `localhost:8000` in component files |
| **`e.preventDefault()` on all forms** | Already done — prevents default browser form submission |
| **Separate `src/api/` files per domain** | `auth.js`, `products.js`, `cart.js` — easier to find and test |
| **Map API response shape to component props** | If the API returns `product_name` but your component expects `name`, do the mapping in the hook, not the component |
