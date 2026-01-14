const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const initSocket = require('./socket');

const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ----------- MIDDLEWARE -----------
app.use(express.json());
app.use(cookieParser());

// 🔐 CORS – STRICT & COOKIE SAFE
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// ----------- SOCKET.IO -----------
const io = initSocket(server);
app.set('io', io);

// ----------- ROUTES -----------
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

// ----------- START SERVER -----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
