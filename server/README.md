# Showcase Portfolio Backend REST API

This is the production-ready REST API backend for a product showcase and portfolio website. It provides admin authentication, product showcase queries, customer testimonial feeds, static settings management, public contact form inbox management, and a dashboard summary endpoint.

## Tech Stack

*   **Runtime:** Node.js
*   **Web Framework:** Express.js (ES Modules)
*   **Database:** MongoDB Atlas (via Mongoose ODM)
*   **Security & Compression:** Helmet, CORS, Express Rate Limit, Compression
*   **Logging:** Morgan
*   **Authentication:** JSON Web Tokens (JWT) & Bcryptjs
*   **Validation:** Express Validator
*   **File Uploads:** Multer (with a Cloudinary-ready configuration)

---

## Installation

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Instance (Local Community Edition or MongoDB Atlas cloud cluster)

### Setup Steps
1. Navigate into the server directory:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and verify or change the port and database connections.

4. Seed the Database:
   Generate the initial admin profile, default setting files, and sample showcases by running the seed command:
   ```bash
   npm run seed
   ```

---

## Environment Variables

The backend relies on the following configurations in your `.env` file:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | Local server port for API | `5000` |
| `NODE_ENV` | Development or Production state | `development` |
| `MONGODB_URI` | Connection URI string | `mongodb://127.0.0.1:27017/portfolio_showcase` |
| `JWT_SECRET` | Secret key used to sign Auth tokens | `super_secret_jwt_signkey_please_change_in_production` |
| `JWT_EXPIRE` | Token validation lifetime | `24h` |
| `ADMIN_EMAIL` | Administrative email for login | `admin@portfolio.com` |
| `ADMIN_PASSWORD` | Administrative password for login | `AdminShowcaseSecurePass2026!` |
| `ADMIN_RESET_SECRET` | Master recovery key for password reset | `emergency_reset_secret_key_2026` |
| `RATE_LIMIT_WINDOW_MS`| Rate Limiter period frame in ms | `900000` (15 mins) |
| `RATE_LIMIT_MAX` | Max allowed requests per IP per window | `150` |
| `CLOUDINARY_CLOUD_NAME`| Cloud name parameter for uploads | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Public API key parameter | `your_api_key` |
| `CLOUDINARY_API_SECRET`| Secret API key parameter | `your_api_secret` |

---

## Scripts

### Running Development Server (with Auto-reload)
Runs Nodemon to watch for code modifications.
```bash
npm run dev
```

### Running Production Server
Runs standard Node runtime targeting the entry point.
```bash
npm start
```

### Seeding database
Clears existing database records and inserts default admin profile and sample data.
```bash
npm run seed
```

---

## Folder Structure

```text
server/
├── public/
│   └── uploads/                # Local file storage fallback
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection config
│   │   └── cloudinary.js       # Cloudinary client & upload wrapper
│   ├── controllers/            # Controller layers for routing handlers
│   ├── middlewares/            # Custom global error, auth, and rate limit middlewares
│   ├── models/                 # Mongoose schemas definitions
│   ├── routes/                 # Express routes configurations
│   ├── services/               # Pure business service layers
│   ├── validators/             # Request field validation rules
│   ├── utils/                  # Common helpers (slugify, custom errors, responses)
│   ├── scripts/
│   │   └── seed.js             # Local db seeding execution script
│   └── app.js                  # Main server setup file
├── .env.example                # Template configuration
├── .env                        # Local active configuration
├── package.json
├── API_DOCUMENTATION.md        # API path methods & response bodies
├── DATABASE_SCHEMA.md          # Collection fields & indexes details
├── PROJECT_CONTEXT.md          # Arch instructions for future developers
└── TODO.md                     # Future expansion roadmap
```

---

## API Routes Summary

### Public Client APIs
*   `GET /api/health` - Check health status of server
*   `GET /api/version` - Check active API build version
*   `GET /api/products` - Browse and filter products (supports category & text search)
*   `GET /api/products/:slug` - Read specific product details
*   `GET /api/products/featured` - Feed of featured products
*   `GET /api/products/category/:categoryName` - Filter products by category
*   `GET /api/testimonials` - Read customer testimonials
*   `POST /api/contact` - Submit contact inquiry form
*   `GET /api/settings` - Read site settings & contact socials

### Administrative Protected APIs (JWT Token Required)
*   `POST /api/auth/login` (Public admin check)
*   `POST /api/auth/reset-password` (Public admin recovery)
*   `GET /api/dashboard` - Retrieve count metrics (Products, Testimonials, Contacts)
*   `POST /api/products` - Create new product (supports image array uploads)
*   `PUT /api/products/:id` - Edit product specifications
*   `DELETE /api/products/:id` - Soft-delete product
*   `PATCH /api/products/:id/toggle-featured` - Switch featured status
*   `PATCH /api/products/:id/toggle-active` - Switch active/hidden status
*   `POST /api/testimonials` - Add customer testimonial (supports single image upload)
*   `PUT /api/testimonials/:id` - Edit customer testimonial
*   `DELETE /api/testimonials/:id` - Delete customer testimonial
*   `GET /api/contact` - View all submitted client inquiries
*   `GET /api/contact/:id` - View single message contents
*   `DELETE /api/contact/:id` - Remove contact message from inbox
*   `PUT /api/settings` - Edit site branding logo, hero headers, and contacts
