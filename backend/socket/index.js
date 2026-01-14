const { Server } = require('socket.io');

const initSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: 'http://localhost:5173', credentials: true }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        // User joins their personal room on connect
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

module.exports = initSocket;
