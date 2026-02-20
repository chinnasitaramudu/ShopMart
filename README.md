# ShopSmart (MERN E-Commerce)

## Purpose
ShopSmart is a full MERN-stack e-commerce application with role-based access.
- `Admin`: product/category/order/user management and dashboard analytics.
- `User`: authentication, product browsing, cart, checkout, order history, profile management.

## Tech Stack
- MongoDB + Mongoose
- Express.js + Node.js
- React.js + React Router + Context API
- JWT authentication
- Bootstrap UI
- Mock payment flow (can be swapped with Stripe)

## Project Structure
- `backend/`: MVC API server
- `frontend/`: React client

## Backend Architecture
- `models`: MongoDB schemas (`User`, `Product`, `Category`, `Order`)
- `controllers`: business logic per module
- `routes`: route mapping and access control
- `middleware`: JWT protection, role authorization, error handling
- `config/db.js`: MongoDB connection bootstrap
- `services/dashboardService.js`: admin analytics aggregation

## Frontend Architecture
- `src/pages`: user/admin/auth/shared route-level views
- `src/components`: reusable UI, forms, layout
- `src/services`: API service layer using Axios
- `src/context`: auth and cart global state
- `src/routes`: protected and role-based route guards

## Authentication Flow
1. User registers or logs in via `/api/auth`.
2. Backend returns JWT token and user payload.
3. Frontend stores token in localStorage.
4. Axios request interceptor sends `Authorization: Bearer <token>`.
5. Backend middleware verifies token and authorizes protected/admin routes.

## Database Connection Flow
1. Backend startup loads env variables from `.env`.
2. `connectDB()` in `backend/config/db.js` reads `MONGO_URI`.
3. Mongoose establishes a shared connection for all models and requests.

## API Integration Flow
1. Frontend services call `src/services/apiClient.js`.
2. Base URL comes from `VITE_API_BASE_URL`.
3. Service modules (`authService`, `productService`, etc.) encapsulate endpoint calls.
4. Pages/components consume service methods and render results.

## Setup Commands
Run these from `c:\ShopMart`:

### 1) Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure Environment
```bash
cd ../backend
copy .env.example .env

cd ../frontend
copy .env.example .env
```

### 3) Start Backend
```bash
cd ../backend
npm run dev
```

### 4) Start Frontend
```bash
cd ../frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Important Notes
- Create one admin account by updating a user role to `admin` from MongoDB (or via admin API after role promotion).
- Payment is implemented as mock payment in checkout and can be replaced with Stripe webhooks/intents.
- All core source files include comments describing purpose and key integration flows.

