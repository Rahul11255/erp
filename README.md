
# K95 Foods — Purchase Request Management Module

> A Mini ERP system for managing employee purchase requests with manager approval workflow, audit logging, and CSV export.

---

## 🔗 Links

| | |
|---|---|
| **GitHub Repository** | [https://github.com/your-username/your-repo-name](https://github.com/Rahul11255/erp) |
| **Live Demo** | [https://your-deployment-url.vercel.app](https://erp-nine-gilt.vercel.app/login) |
| **Demo Video** | [https://your-demo-video-link.com](https://file72.com/f/G5rxPyarve) |

---

## 📋 Overview

This is a full-stack Purchase Request Management Module built for **K95 Foods Pvt. Ltd. (Toyo Kombucha)** as part of a Junior Full Stack Developer technical assignment.

Employees can create and submit purchase requests. Managers can review, approve, or reject them. Every status change is recorded in an audit log with timestamps and user details.

---

## ✨ Features

- **Google OAuth 2.0** login restricted to company domain
- **Role-based access** — Employee and Manager roles
- **Purchase request workflow** — Draft → Submitted → Approved / Rejected
- **Dashboard** with stats — Total, Pending, Approved, Rejected
- **Approval management** — Managers can approve or reject with remarks
- **Search & filters** — Filter by Status, Department, Priority, Date Range
- **Audit logs** — Every status change is recorded with timestamp and user
- **CSV export** — Export filtered purchase requests as CSV

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS + Ant Design |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM / Query Builder | Knex.js |
| Auth | Google OAuth 2.0 (Google Identity Services) |
| HTTP Client | Axios |

---

## 📁 Folder Structure

### Backend (`/api`)

```
api/
├── src/
│   ├── api/
        ├── services/ all business logic here 
│   │   ├── middlewares/
│   │   │   └── user.js               # Auth middleware (protect, managerOnly)
│   │   └── modules/
│   │       └── admin/
│   │           ├── audit-logs/
│   │           │   ├── route.js
│   │           │   ├── controller.js
│   │           │   
│   │           ├── dashboard/
│   │           │   ├── route.js
│   │           │   ├── controller.js
│   │           │  
│   │           ├── purchase_requests/
│   │           │   ├── route.js
│   │           │   ├── controller.js
│   │           │   
│   │           └── user/
│   │               ├── route.js
│   │               ├── controller.js
│   │               
│   ├── db/
│   │   ├── migrations/
│   │   │   ├── 20260523171122_create_user_table.js
│   │   │   ├── 20260524073717_create_purchase_requests.js
│   │   │   └── 20260524074110_create_audit_logs.js
│   │   └── db.js                     # Knex PostgreSQL connection
│   └── utilities/
│       ├── Message.js                # Response message constants
│       └── Response.js               # Response helper class
├── .env
├── .env.example
├── index.js                          # Server entry point
├── knexfile.js                       # Knex configuration
└── package.json
```

### Frontend (`/erp-dashboard`)

```
erp-dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── HeaderBar.jsx             # Top navbar with user info
│   │   └── SidebarMenu.jsx           # Role-based sidebar navigation
│   ├── layouts/
│   │   └── AppLayout.jsx             # Main layout wrapper
│   ├── pages/
│   │   ├── AuditLogs.jsx             # Audit log list page
│   │   ├── Dashboard.jsx             # Dashboard with stats + activity
│   │   ├── Login.jsx                 # Google OAuth login page
│   │   ├── ManagePurchaseRequests.jsx # Manager approval page
│   │   └── PurchaseRequests.jsx      # Employee request list + create
│   └── utils/
│       ├── axios.js                  # Axios instance with interceptors
│       ├── config.js                 # API base URL config
│       └── helperFunction.js         # getToken, getUserInfo helpers
├── App.jsx                           # Routes + role-based guards
├── main.jsx                          # React entry point
├── index.html                        # Google GSI script tag here
├── .env
├── .env.example
└── package.json
```

---

## ⚙️ Environment Variables

### Backend `.env.example`

```bash
PORT=4005
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pr_module

GOOGLE_CLIENT_ID=your_google_client_id_here

JWT_SECRET=your_jwt_secret_here
ALLOWED_DOMAIN=k95foods.com
```

### Frontend `.env.example`

```bash
VITE_API_URL=http://localhost:4005
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> ⚠️ Never commit `.env` files with real credentials. Only `.env.example` is committed.

---

## 🗄️ Database Setup

### 1. Create the database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE pr_module;
```

### 2. Run migrations

```bash
cd api
npx knex migrate:latest
```

This creates 3 tables:

| Table | Purpose |
|---|---|
| `users` | Stores all users who log in via Google OAuth |
| `purchase_requests` | Stores all purchase requests |
| `audit_logs` | Records every status change with timestamp |

### 3. To rollback migrations

```bash
npx knex migrate:rollback
```

---

## 🚀 How to Run

### Backend (API)

```bash
# Step 1 — go to api folder
cd api

# Step 2 — install dependencies
npm install

# Step 3 — create .env file
cp .env.example .env
# Fill in your values in .env

# Step 4 — run database migrations
npx knex migrate:latest

# Step 5 — start the server
npm run dev

# Server runs on http://localhost:4005
```

### Frontend

```bash
# Step 1 — go to frontend folder
cd erp-dashboard

# Step 2 — install dependencies
npm install

# Step 3 — create .env file
cp .env.example .env
# Fill in your values in .env

# Step 4 — start the dev server
npm run dev

# App runs on http://localhost:5173
```

---

## 🔐 API Endpoints

## 🔐 API Endpoints

### Auth / User
| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `POST` | `/admin/users/google-login` | Public | Login with Google token |
| `GET` | `/admin/users/me` | Protected | Get current logged in user |
| `GET` | `/admin/users/list-user` | Manager | List all users |

### Purchase Requests
| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/admin/purchase/list` | Protected | List requests (role filtered) |
| `POST` | `/admin/purchase/create` | Employee | Create new request |
| `PUT` | `/admin/purchase/update/:id` | Employee | Update draft request |
| `PUT` | `/admin/purchase/update-status/:id` | Manager | Approve or reject request |

### Audit Logs
| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/admin/audit-logs/list` | Protected | List audit logs (role filtered) |

### Dashboard
| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/admin/dashboard/details` | Protected | Dashboard stats + activity feed |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **EMPLOYEE** | Create requests, view own requests, submit drafts, view own audit logs |
| **MANAGER** | View all submitted/approved/rejected requests, approve or reject, view all audit logs |


## 🤖 AI Usage Disclosure

This project was built with AI assistance as part of the assignment requirements. Full transparency:

| Item | Detail |
|---|---|
| **AI tools used** | Claude (Anthropic) / GPT |
| **Modules AI-assisted** | Knex query structure, Express route boilerplate, React component structure, Tailwind layout |
| **Bugs debugged manually** | Knex `orderBy` before `where` causing filter to be ignored, UUID type mismatch in audit log employee filter, localStorage key inconsistency between login and home page |

---

## ⚠️ Known Limitations

1. **Domain restriction** — `@k95foods.com` domain restriction logic is implemented
   and configurable via `ALLOWED_DOMAIN` env variable. Set to `gmail.com` for local
   testing since company email credentials are not available.

2. **Role assignment** — New users default to `EMPLOYEE` role. Manager promotion is
   done manually via SQL. An admin panel for role management was not built due to the
   48-hour time constraint.

3. **No refresh token** — JWT expires in 7 days. No refresh token mechanism implemented.

4. **No real-time updates** — Dashboard stats and request lists require manual page
   refresh to see latest data. No WebSocket or polling implemented.

5. **No email notifications** — Managers are not notified when a new request is
   submitted. Employees are not notified when their request is approved or rejected.

6. **No file attachments** — Purchase requests do not support file or image attachments.

7. **No pagination on audit logs** — Audit logs load all records without server-side
   pagination.

8. **Manual API calls** — All API calls use plain Axios without caching, background
   refetch, or stale-while-revalidate behavior.

---

## 🚀 Future Improvements

### 1. Real-time updates with WebSockets

Currently the dashboard and request lists require a manual refresh. With WebSockets,
managers would see new requests appear instantly and employees would be notified the
moment their request is approved or rejected.

**Planned implementation:**
- Add `socket.io` to the Express backend
- Emit events on every status change — `request:submitted`, `request:approved`,
  `request:rejected`
- Frontend listens and updates the UI without a page reload




---

## 📸 Screenshots
LOGIN
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/e619f1c5-381d-4e2e-9b8d-e920f82a9e24" />

Dashboard
<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/d0b24657-e397-4981-97f8-75d6015b42a5" />

Create Purchase Req
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/04c9b180-26c4-4333-9c29-47d3e8d2fd7b" />
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/b0c05704-73fa-497e-998f-c43b911ef274" />

All Purchase Req
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/15a37fca-6821-4ac6-80e4-88e34254c171" />
<img width="1918" height="922" alt="image" src="https://github.com/user-attachments/assets/f3220c9b-aec1-4669-8656-28be61ea1098" />


Audit Logs
<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/8ae9be3c-1cf2-4d81-ad01-3aae3a52b055" />
<img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/5893fc01-9db2-4b4e-9cdf-ff1e37521131" />

