# Warehouse Connect Frontend

The premium, high-performance web portal for Warehouse Connect, built with Next.js 14 and Vanilla CSS.

## 🚀 Quick Start

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env.local` file (already provided in local dev) with the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗺️ Page Directory (Sitemap)

### Public Pages
- `/` — Landing page with value proposition and search entry.
- `/warehouses` — Marketplace / Search results with advanced filters.
- `/warehouses/[id]` — Public warehouse profile & enquiry form.

### Auth
- `/login` — Unified login for all roles.
- `/register` — New user registration.

### Owner Portal
- `/dashboard` — KPI overview, recent enquiries, and property management.
- `/warehouses/new` — Listing creation wizard.
- `/kyc` — Verification submission flow.
- `/enquiries/[id]` — **Negotiation Center**: Chat with customers and manage leads.

### Admin Portal
- `/admin` — Platform metrics and high-level stats.
- `/admin/kyc` — KYC verification queue.
- `/admin/warehouses` — Warehouse approval queue.

## 🧪 Testing Credentials

Use the following accounts to test different roles. The password for all mock accounts is **`password`**.

| Role | Email ID | Description |
|---|---|---|
| **Super Admin** | `admin@warehouseconnect.com` | Full platform control, review queues. |
| **Warehouse Owner** | `owner@example.com` | Manage properties, respond to leads. |
| **Customer** | `user@example.com` | Search and submit enquiries. |

## 💡 Key Features for Users & Admins

### For Warehouse Owners
1. **List Property:** Use the `/warehouses/new` page to add your facility.
2. **Negotiation Center:** When a customer submits an enquiry, click it in your dashboard to open the chat interface. You can accept interest or decline leads directly.
3. **KYC Verification:** You must complete KYC via the `/kyc` page before your listings can be approved.

### For Platform Admins
1. **KYC Review:** Visit `/admin/kyc` to approve or reject owner documentation.
2. **Listing Approval:** New warehouses appear in `/admin/warehouses`. They must be approved before appearing in public search results.
3. **KPIs:** The `/admin` dashboard provides real-time counts of users, listings, and active enquiries.

## 🎨 Design System
- **Styling:** Modular Vanilla CSS in `globals.css` and component-level styles.
- **Components:** Custom-built premium components (Badges, Buttons, Cards, Modals).
- **Icons:** Standardized emoji-based iconography for a clean, industrial look.
