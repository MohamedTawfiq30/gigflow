# 🚀 GigFlow - Micro-SaaS Freelance Marketplace

GigFlow is a modern, real-time freelance marketplace connecting clients with talented freelancers. It features a seamless user experience, real-time notifications, and a robust hiring workflow.

![GigFlow Screenshot](https://via.placeholder.com/800x400?text=GigFlow+Preview) *Replace with actual screenshot*

## ✨ Features

- **Authentication**: Secure Login/Register (JWT & HttpOnly Cookies).
- **Gig Management**:
  - Post new gigs with budget (₹) and detailed descriptions.
  - Edit and Delete gigs.
  - Search/Filter gigs.
- **Bidding System**:
  - Freelancers can place bids on open gigs.
  - Clients can view all proposals for their gigs.
  - **Hiring Logic**: When a freelancer is hired, others are automatically rejected.
- **Real-Time Notifications 🔔**:
  - Instant alerts for "Hired", "Rejected", and "New Proposal" events using **Socket.io**.
  - Notification dropdown in the Navbar.
- **Dashboard**: Centralized hub to manage your Gigs and Bids.
- **Responsive Design**: Built with Tailwind CSS for a beautiful, mobile-friendly UI.

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Styling)
- **Socket.io Client** (Real-time communication)
- **Axios** (API requests)
- **React Router v6** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB Atlas** (Database)
- **Mongoose** (ODM)
- **Socket.io** (WebSockets)
- **JWT** (Authentication)

## ⚡ Installation & Setup

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

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

### 4. Run the Application
You need to run both backend and frontend servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the app!

## 📂 Project Structure

```
gigflow/
├── backend/            # Express Server & DB Models
│   ├── config/         # DB Connection
│   ├── controllers/    # Logic for Auth, Gigs, Bids
│   ├── middleware/     # Auth Protection
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Routes
│   └── socket/         # Socket.io Logic
│
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── contexts/   # Auth & Notification Contexts
    │   ├── pages/      # Application Pages
    │   └── services/   # API Configuration
```

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
