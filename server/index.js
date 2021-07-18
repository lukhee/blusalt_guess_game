const express = require('express');
// const path = require('path')
const http = require('http');
const PORT = process.env.PORT || 4000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const router = require('./routes/index');

// routes
app.use(router);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle a socket connection request from web client
const connectedUsers = [null, null];

// Handle a socket connection request from web client
io.on('connection', (socket) => {
  // Find an available player number
  let playerIndex = -1;
  for (const i in connectedUsers) {
    if (connectedUsers[i] === null) {
      playerIndex = i;
      break;
    }
  }

  // Tell the connecting client what player number they are
  socket.emit('player-number', playerIndex);

  socket.on('start-game', ({ playerOne }) => {
    console.log('playerOne start game');
  });

  // Ignore player 3
  if (playerIndex === -1) return;

  connectedUsers[playerIndex] = false;

  // Tell eveyone what player number just connected
  socket.broadcast.emit('player-connection', playerIndex);

  // End Connection
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`);
    connectedUsers[playerIndex] = null;
    //Tell everyone what player numbe just disconnected
    socket.broadcast.emit('player-connection', playerIndex);
  });
});
