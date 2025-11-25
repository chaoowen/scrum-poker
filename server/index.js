const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL || "*"  // In production, use FRONTEND_URL env var
            : "*", // Allow all origins in development
        methods: ["GET", "POST"]
    }
});

// Store room state
// roomCode -> { players: [], gameState: 'waiting' | 'voting' | 'revealed', votes: {} }
const rooms = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ roomCode, name }) => {
        socket.join(roomCode);

        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                gameState: 'waiting',
                votes: {}
            };
        }

        const room = rooms[roomCode];
        const existingPlayer = room.players.find(p => p.id === socket.id);

        if (!existingPlayer) {
            room.players.push({ id: socket.id, name, hasVoted: false });
        }

        // Notify everyone in the room about the new player list and current state
        io.to(roomCode).emit('room_update', room);
    });

    socket.on('start_voting', (roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode].gameState = 'voting';
            // Reset votes when starting new round? Or just change state?
            // Usually "Start Voting" implies a new round or moving from waiting.
            // If we want to keep previous votes until reset, we wouldn't clear here.
            // But let's assume "Start Voting" is the trigger to enable voting.
            io.to(roomCode).emit('room_update', rooms[roomCode]);
        }
    });

    socket.on('vote', ({ roomCode, value }) => {
        if (rooms[roomCode]) {
            const room = rooms[roomCode];
            room.votes[socket.id] = value;

            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.hasVoted = true;
            }

            io.to(roomCode).emit('room_update', room);
        }
    });

    socket.on('reveal_votes', (roomCode) => {
        if (rooms[roomCode]) {
            const room = rooms[roomCode];
            const allVoted = room.players.every(p => p.hasVoted);

            if (allVoted) {
                room.gameState = 'revealed';
                io.to(roomCode).emit('room_update', room);
            }
        }
    });

    socket.on('leave_room', (roomCode) => {
        if (rooms[roomCode]) {
            const room = rooms[roomCode];
            const index = room.players.findIndex(p => p.id === socket.id);

            if (index !== -1) {
                room.players.splice(index, 1);
                socket.leave(roomCode);

                if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    // Also remove their vote if they leave? 
                    // Usually yes, otherwise we might be waiting for a ghost.
                    if (room.votes[socket.id]) {
                        delete room.votes[socket.id];
                    }
                    io.to(roomCode).emit('room_update', room);
                }
            }
        }
    });

    socket.on('reset_game', (roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode].gameState = 'voting'; // Go back to voting immediately? Or waiting?
            // Let's go to voting as "Play Again" usually means start next round.
            rooms[roomCode].votes = {};
            rooms[roomCode].players.forEach(p => p.hasVoted = false);
            io.to(roomCode).emit('room_update', rooms[roomCode]);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove player from all rooms they were in
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                // If room is empty, maybe delete it?
                if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    if (room.votes[socket.id]) {
                        delete room.votes[socket.id];
                    }
                    io.to(roomCode).emit('room_update', room);
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
