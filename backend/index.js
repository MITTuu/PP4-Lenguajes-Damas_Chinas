import { Server } from 'socket.io';
import { createGame, joinGame, getAvailableGames } from './controllers/game.controller.js';

const io = new Server(5000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("createGame", (data, callback) => createGame(io, socket, data, callback));
  socket.on("joinGame", (data, callback) => joinGame(io, socket, data, callback));
  socket.on("getAvailableGames", (callback) => getAvailableGames(callback));

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
  });
});
