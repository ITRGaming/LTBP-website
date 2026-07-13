# REST API Specification & Endpoint Documentation

All endpoints respond with unified JSON shapes. Success payloads contain `success: true` and optionally a `data` parameter. Failures carry `success: false` and a descriptive `message` (and validation errors when applicable).

---

## Authentication Endpoints

### 1. Admin Login
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Authentication:** None (Public)
*   **Request Body (JSON):**
    ```json
    {
      "email": "admin@portfolio.com",
      "password": "AdminShowcaseSecurePass2026!"
    }
    ```
*   **Response Codes:**
    *   `200 OK` (Successful Authentication)
    *   `400 Bad Request` (Invalid payload email/password validation)
    *   `401 Unauthorized` (Incorrect email or password)
*   **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Login successful. Session initiated.",
      "data": {
        "admin": {
          "_id": "660c1d2e1b12b509f6b4a530",
          "email": "admin@portfolio.com",
          "createdAt": "2026-07-13T10:00:00.000Z",
          "updatedAt": "2026-07-13T10:00:00.000Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

### 2. Admin Reset Password
*   **URL:** `/api/auth/reset-password`
*   **Method:** `POST`
*   **Authentication:** None (Public - uses token or master secret)
*   **Request Body (JSON):**
    ```json
    {
      "email": "admin@portfolio.com",
      "newPassword": "NewSuperSecureAdminPassword2026!",
      "recoverySecret": "emergency_reset_secret_key_2026"
    }
    ```
    *Note: Replace `recoverySecret` with `token` if utilizing token-based database reset.*
*   **Response Codes:**
    *   `200 OK` (Password successfully reset)
    *   `400 Bad Request` (Password under 8 characters or missing secrets)
    *   `404 Not Found` (Admin email does not exist)
*   **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Password reset successful. Please login with your new password."
    }
    ```

---

## Products Endpoints

### 1. Browse Products (with search & filters)
*   **URL:** `/api/products`
*   **Method:** `GET`
*   **Authentication:** None (Public)
*   **Query Parameters:**
    *   `category` (string, optional) - Filter by category
    *   `search` (string, optional) - Full-text search
    *   `page` (number, default: 1) - Page number
    *   `limit` (number, default: 10) - Items per page
    *   `sort` (string, default: `-createdAt`) - Sorting parameter
*   **Response Codes:** `200 OK`
*   **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Products retrieved successfully.",
      "data": {
        "products": [
          {
            "_id": "660c1d2e1b12b509f6b4a544",
            "name": "The Heritage Leather Backpack",
            "slug": "the-heritage-leather-backpack",
            "shortDescription": "Handcrafted full-grain leather backpack.",
            "description": "Full-grain vegetable-tanned leather backpack details...",
            "category": "Bags",
            "images": [
              {
                "url": "/uploads/leather-backpack-1.jpg",
                "public_id": "local_backpack_1"
              }
            ],
            "availableColors": ["Chestnut Brown", "Charcoal Black"],
            "availableSizes": ["Standard (20L)"],
            "material": "Full-Grain Leather",
            "features": ["Laptop sleeve (16\")"],
            "isFeatured": true,
            "isActive": true,
            "createdAt": "2026-07-13T10:00:00.000Z",
            "updatedAt": "2026-07-13T10:00:00.000Z"
          }
        ],
        "pagination": {
          "total": 1,
          "page": 1,
          "limit": 10,
          "pages": 1
        }
      }
    }
    ```

### 2. View Product Details
*   **URL:** `/api/products/:slug`
*   **Method:** `GET`
*   **Authentication:** None (Public)
*   **Response Codes:**
    *   `200 OK`
    *   `404 Not Found` (Product slug not found)
*   **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Product details retrieved successfully.",
      "data": {
        "_id": "660c1d2e1b12b509f6b4a544",
        "name": "The Heritage Leather Backpack",
        "slug": "the-heritage-leather-backpack",
        "shortDescription": "Handcrafted full-grain leather backpack.",
        "description": "Full-grain vegetable-tanned leather backpack details...",
        "category": "Bags",
        "images": [{"url": "/uploads/backpack.jpg", "public_id": "local_backpack_1"}],
        "availableColors": ["Chestnut Brown"],
        "availableSizes": ["Standard"],
        "material": "Leather",
        "features": ["Pockets"],
        "isFeatured": true,
        "isActive": true
      }
    }
    ```

### 3. Get Featured Products
*   **URL:** `/api/products/featured`
*   **Method:** `GET`
*   **Authentication:** None (Public)
*   **Response Codes:** `200 OK`

### 4. Create Product (Multipart Form-Data)
*   **URL:** `/api/products`
*   **Method:** `POST`
*   **Authentication:** Admin (Bearer JWT required)
*   **Request Format:** `multipart/form-data`
*   **Parameters:**
    *   `name` (string, required)
    *   `shortDescription` (string, max: 300, required)
    *   `description` (string, required)
    *   `category` (string, required)
    *   `material` (string, optional)
    *   `availableColors` (comma-separated string e.g. `Brown,Black`, optional)
    *   `availableSizes` (comma-separated string, optional)
    *   `features` (comma-separated string, optional)
    *   `isFeatured` (boolean/string 'true'/'false', default: false)
    *   `images` (files, optional) - Send multiple image files
*   **Response Codes:**
    *   `201 Created`
    *   `400 Bad Request` (Validation errors or duplicate name)
    *   `401 Unauthorized` (Token expired or missing)

### 5. Update Product (Multipart Form-Data)
*   **URL:** `/api/products/:id`
*   **Method:** `PUT`
*   **Authentication:** Admin (Bearer JWT required)
*   **Parameters:** Same as Create Product (all fields optional).
    *   `deletedImages` (comma-separated public IDs of images to remove, optional)
*   **Response Codes:**
    *   `200 OK`
    *   `404 Not Found` (ID not found)

### 6. Delete Product (Soft Delete)
*   **URL:** `/api/products/:id`
*   **Method:** `DELETE`
*   **Authentication:** Admin (Bearer JWT required)
*   **Response Codes:**
    *   `200 OK` (Sets product `isDeleted: true` and hides from public views)
    *   `404 Not Found`

---

## Testimonials Endpoints

### 1. Retrieve Testimonials
*   **URL:** `/api/testimonials`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `featured` (boolean string: `true`, optional) - Retrieve featured only
    *   `limit` (number, default: 50, optional)
*   **Response Codes:** `200 OK`

### 2. Create Testimonial (Multipart Form-Data)
*   **URL:** `/api/testimonials`
*   **Method:** `POST`
*   **Authentication:** Admin (Bearer JWT required)
*   **Parameters:**
    *   `customerName` (string, required)
    *   `message` (string, required)
    *   `source` (string, values: `WhatsApp`, `Instagram DM`, `Instagram Story`, `Text`, required)
    *   `rating` (integer 1-5, optional)
    *   `isFeatured` (boolean string, optional)
    *   `image` (file, optional) - Single customer profile file
*   **Response Codes:**
    *   `201 Created`
    *   `400 Bad Request` (Validation error)

### 3. Delete Testimonial
*   **URL:** `/api/testimonials/:id`
*   **Method:** `DELETE`
*   **Authentication:** Admin (Bearer JWT required)
*   **Response Codes:** `200 OK`, `404 Not Found`

---

## Contact Inquiries Endpoints

### 1. Submit Contact Form
*   **URL:** `/api/contact`
*   **Method:** `POST`
*   **Authentication:** None (Public)
*   **Request Body (JSON):**
    ```json
    {
      "name": "Jane Miller",
      "email": "jane@example.com",
      "phone": "+19998887777",
      "message": "Hi, I would like to query about your Heritage Leather Backpack color customization options."
    }
    ```
*   **Response Codes:**
    *   `201 Created`
    *   `400 Bad Request` (Validation errors)
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Contact message submitted successfully. We will get back to you shortly."
    }
    ```

### 2. View Contact Messages
*   **URL:** `/api/contact`
*   **Method:** `GET`
*   **Authentication:** Admin (Bearer JWT required)
*   **Response Codes:** `200 OK`, `401 Unauthorized`

---

## Website Settings Endpoints

### 1. Retrieve Global Settings
*   **URL:** `/api/settings`
*   **Method:** `GET`
*   **Authentication:** None (Public)
*   **Response Codes:** `200 OK`
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Global website settings retrieved successfully.",
      "data": {
        "businessName": "Luxe Craft Showcase",
        "phone": "+1 (555) 019-2834",
        "whatsapp": "+1 (555) 019-9988",
        "email": "hello@luxecraft.com",
        "instagram": "https://instagram.com/luxecraft_showcase",
        "address": "742 Amberwood Lane, Design District, NY 10001",
        "aboutText": "Company description here...",
        "logo": {
          "url": "/uploads/default-logo.png",
          "public_id": "local_logo"
        },
        "heroImage": {
          "url": "/uploads/default-hero.jpg",
          "public_id": "local_hero"
        }
      }
    }
    ```

### 2. Update Settings (Multipart Form-Data)
*   **URL:** `/api/settings`
*   **Method:** `PUT`
*   **Authentication:** Admin (Bearer JWT required)
*   **Parameters:**
    *   `businessName`, `phone`, `whatsapp`, `email`, `instagram`, `address`, `aboutText` (optional)
    *   `logo` (file, optional) - Update logo image file
    *   `heroImage` (file, optional) - Update landing banner image file
*   **Response Codes:** `200 OK`, `401 Unauthorized`

---

## Dashboard Endpoint

### 1. Get Dashboard Summary Statistics
*   **URL:** `/api/dashboard`
*   **Method:** `GET`
*   **Authentication:** Admin (Bearer JWT required)
*   **Response Codes:** `200 OK`, `401 Unauthorized`
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Dashboard summary statistics retrieved successfully.",
      "data": {
        "totalProducts": 4,
        "featuredProducts": 3,
        "totalTestimonials": 4,
        "totalContacts": 0
      }
    }
    ```
