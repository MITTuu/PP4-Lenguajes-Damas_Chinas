import { Server, Socket } from 'socket.io';
import { Game, CreateGameData, JoinGameData } from './types/game';

let games: Game[] = [];

export const createGame = (io: Server, socket: Socket, data: CreateGameData, callback: Function) => {
  const { gameCode, numPlayers, creator } = data;
  console.log("Datos recibidos en createGame:", { gameCode, numPlayers, creator });

  const existingGame = games.find((game) => game.gameCode === gameCode);

  if (existingGame) {
    return callback({ success: false, message: "El código de la sala ya existe" });
  }

  const newGame: Game = {
    gameCode,
    numPlayers,
    creator: socket.id,
    players: [{ id: socket.id, nickname: creator }],
    isStarted: false,
  };

  games.push(newGame);
  socket.join(gameCode);
  callback({ success: true, game: newGame });
  io.emit("gamesUpdated", games);
};

export const joinGame = (io: Server, socket: Socket, data: JoinGameData, callback: Function) => {
  if (!data.gameCode || !data.nickname) {
    return callback({ success: false, message: "Faltan datos necesarios para unirse al juego" });
  }

  const { gameCode, nickname } = data;
  const game = games.find((g) => g.gameCode === gameCode);

  if (game && game.players.length < game.numPlayers) {
    game.players.push({ id: socket.id, nickname });
    socket.join(gameCode);
    callback({ success: true, game });
    io.emit("gamesUpdated", games);
  } else {
    callback({ success: false, message: "No se pudo unir a la sala" });
  }
};

export const getAvailableGames = (callback: Function) => {
  callback({
    success: true,
    games: games.filter((game) => !game.isStarted),
  });
};
