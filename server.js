// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = new Map(); // Store room information

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle room creation
    socket.on('createRoom', (roomId) => {
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(socket.id);
        socket.join(roomId);
        io.to(roomId).emit('userJoined', socket.id);
    });

    // Handle room joining
    socket.on('joinRoom', (roomId) => {
        if (rooms.has(roomId)) {
            rooms.get(roomId).add(socket.id);
            socket.join(roomId);
            io.to(roomId).emit('userJoined', socket.id);
        }
    });

    // Handle signaling for WebRTC (Offer, Answer, IceCandidate)
    socket.on('offer', (data) => {
        io.to(data.target).emit('offer', data);
    });

    socket.on('answer', (data) => {
        io.to(data.target).emit('answer', data);
    });

    socket.on('iceCandidate', (data) => {
        io.to(data.target).emit('iceCandidate', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        for (const [roomId, users] of rooms.entries()) {
            if (users.has(socket.id)) {
                users.delete(socket.id);
                io.to(roomId).emit('userLeft', socket.id);
                if (users.size === 0) {
                    rooms.delete(roomId);
                }
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
