# 🚀 GigFlow - Micro-SaaS Freelance Marketplace

GigFlow is a modern, real-time freelance marketplace connecting clients with talented freelancers. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and powered by **Socket.io** for instant notifications.

![GigFlow Banner](https://via.placeholder.com/1200x500?text=GigFlow+Marketplace+Preview)

## ✨ Features

- **🔐 User Authentication**: Secure Login/Register with JWT & HttpOnly Cookies.
- **💼 Gig Management**: Post, Edit, and Delete gigs. Set budgets in ₹ (Rupees).
- **📝 Bidding System**: Freelancers can place proposals on open gigs.
- **⚡ Real-time Notifications**: 
  - Instant alerts when **Hired**.
  - Instant alerts when **Rejected**.
  - Notifications for new **Proposals** (for gig owners).
- **📊 Interactive Dashboard**: Manage your Gigs and Bids in one place.
- **🎨 Modern UI**: Built with React + Tailwind CSS for a premium look and feel.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast and modern UI library.
- **Tailwind CSS**: Utility-first styling.
- **Socket.io-client**: Real-time events.
- **Axios**: API requests.

### Backend
- **Node.js & Express**: Robust server framework.
- **MongoDB & Mongoose**: NoSQL Database (Atlas Cloud).
- **Socket.io**: Real-time bi-directional communication.
- **JWT**: Secure authentication.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/MohamedTawfiq30/gigflow.git
cd gigflow
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Run the Server:**
```bash
npm run dev
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder:
```bash
cd frontend
npm install
```

**Run the Frontend:**
```bash
npm run dev
```
*App runs on http://localhost:5173*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| **Gigs** | | |
| `GET` | `/api/gigs` | Get all open gigs |
| `POST` | `/api/gigs` | Create a new gig |
| `GET` | `/api/gigs/:id` | Get gig details |
| `DELETE` | `/api/gigs/:id` | Delete a gig |
| `PATCH` | `/api/gigs/:id/hire/:bidId` | Hire a freelancer |
| **Bids** | | |
| `POST` | `/api/bids/:gigId` | Place a bid |
| `GET` | `/api/bids/my-bids` | Get user's bids |
| `DELETE` | `/api/bids/:id` | Withdraw a bid |

---

## 👤 Author
**Md Tawfiq**  
GitHub: [MohamedTawfiq30](https://github.com/MohamedTawfiq30)