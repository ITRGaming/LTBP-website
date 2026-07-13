# Future Backlog & Enhancement Roadmap

Below is a planned list of future features and architectural upgrades that can be implemented on top of the current backend structure.

---

## 1. Product & Media Enhancements

- [ ] **Dynamic Category Management**
  - Create a dedicated `Category` collection containing details (slug, icon, banner, sequence position).
  - Modify `Product` schema to reference the `Category` ObjectId instead of using a static string.
- [ ] **Product Tags & Labels**
  - Add tag arrays (e.g. `['New', 'Eco-friendly', 'Trending']`) to allow granular filtering and marketing banners.
- [ ] **Flexible Ordering / Sorting**
  - Add a `sortOrder` index field to the product schema to allow administrators to drag-and-drop or order items explicitly on the landing pages.
- [ ] **Full Cloudinary CDN Activation**
  - Install Cloudinary SDK via `npm install cloudinary`.
  - Supply cloud keys to `.env` variables to transition uploads from local storage to the Cloudinary CDN.

---

## 2. SEO & Crawlers Support

- [ ] **SEO Meta API**
  - Expand `Settings` or `Product` schema to hold custom SEO parameters (meta title, meta description, schema.org JSON-LD blocks, open-graph tags).
- [ ] **Automated Sitemap Generator**
  - Create `GET /sitemap.xml` endpoint that crawls active product slugs, static website routes, and categories, outputting standard XML sitemaps for Google Indexers.

---

## 3. Communication & Logging

- [ ] **Email Notifications**
  - Integrate Nodemailer or SendGrid.
  - Automatically dispatch alert emails to the business admin when a customer submits a contact inquiry, and dispatch confirmation emails back to the customer.
- [ ] **Administrative Audit Logs**
  - Create an `AuditLog` collection to record which admin performed what change and when (e.g. `Product Created: Heritage Backpack by admin@portfolio.com`).
- [ ] **Activity & Request Analytics**
  - Capture general public traffic parameters (visited product slugs, category filters) to render a traffic analytics widget on the dashboard.

---

## 4. Multi-Admin & Security Scaling

- [ ] **Role-Based Access Control (RBAC)**
  - Expand the `Admin` model to support roles such as `Super Admin` (can reset settings/add admins) and `Editor` (can only update products and read contacts).
- [ ] **Multi-Admin Management**
  - Implement administration invitations, setup profile pages, and build creation/deletion APIs for administrators.
