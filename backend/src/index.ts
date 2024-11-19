import { Server, Socket } from "socket.io";
const { getAdjustedPositions } = require("./game/utils/positions");
import { Game, GameConfig, Player } from "./types/gameTypes";

const io = new Server(5000, {
  cors: {
    origin: "*",
  },
});

// Lista de juegos en memoria
let games: Game[] = [];

// Obtener salas disponibles
const getAvailableGames = (): Game[] =>
  games.filter((game) => !game.isStarted && game.playersJoined < game.numPlayers);

io.on("connection", (socket: Socket) => {
  console.log("Jugador conectado:", socket.id);

  // Crear sala de juego
  socket.on(
    "createGame",
    (gameConfig: GameConfig, callback: (response: { success: boolean; message?: string; game?: Game }) => void) => {
      console.log("Datos recibidos en createGame:", gameConfig);

      if (!callback || typeof callback !== "function") {
        console.error("Callback no proporcionado o no es una función");
        return;
      }

      const { gameCode, numPlayers, creator, gameType, gameTime } = gameConfig;

      if (!gameCode || !numPlayers || !creator) {
        return callback({
          success: false,
          message: "Faltan datos necesarios para crear la partida",
        });
      }

      const existingGame = games.find((game) => game.gameCode === gameCode);

      if (existingGame) {
        return callback({ success: false, message: "El código de la sala ya existe" });
      }

      const newGame: Game = {
        gameCode,
        numPlayers,
        creator: socket.id,
        players: [{ id: socket.id, nickname: creator }],
        playersJoined: 1,
        gameType,
        gameTime,
        isStarted: false,
      };

      games.push(newGame);
      socket.join(gameCode);
      callback({ success: true, game: newGame });

      const availableGames = getAvailableGames();
      if (availableGames.length > 0) {
        io.emit("gamesUpdated", availableGames);
      }
    }
  );

  // Obtener salas disponibles
  socket.on("getAvailableGames", (callback: (response: { success: boolean; message?: string; games?: Game[] }) => void) => {
    const availableGames = getAvailableGames();
    if (availableGames.length > 0) {
      console.log("Enviando salas disponibles:", availableGames);
      return callback({ success: true, games: availableGames });
    }

    return callback({
      success: false,
      message: "No hay salas disponibles",
      games: [],
    });
  });

  // Unirse a una sala de juego
  socket.on(
    "joinGame",
    (
      { gameCode, nickname }: { gameCode: string; nickname: string },
      callback: (response: { success: boolean; message?: string; game?: Game }) => void
    ) => {
      const game = games.find((g) => g.gameCode === gameCode);

      if (!game) {
        return callback({ success: false, message: "Sala no encontrada" });
      }

      if (game.isStarted) {
        return callback({ success: false, message: "La partida ya comenzó" });
      }

      if (game.playersJoined >= game.numPlayers) {
        return callback({ success: false, message: "Sala llena" });
      }

      const newPlayer: Player = { id: socket.id, nickname };
      game.players.push(newPlayer);
      game.playersJoined += 1;

      socket.join(gameCode);
      io.to(gameCode).emit("playerJoined", game);

      callback({ success: true, game });

      const availableGames = getAvailableGames();
      if (availableGames.length > 0) {
        io.emit("gamesUpdated", availableGames);
      }
    }
  );

  // Iniciar el juego
  socket.on("startGame", (gameCode: string, callback: (response: { success: boolean; message?: string }) => void) => {
    const game = games.find((g) => g.gameCode === gameCode);

    if (!game) {
      return callback({ success: false, message: "Sala no encontrada" });
    }

    if (game.players.length < game.numPlayers) {
      return callback({ success: false, message: "No hay suficientes jugadores para iniciar el juego" });
    }

    game.isStarted = true;

    // Obtener las posiciones iniciales para el tablero segun la cantidad de jugadores
    const adjustedPositions = getAdjustedPositions(game.numPlayers);

    const availableColors = Object.keys(adjustedPositions).filter(
        (color) => adjustedPositions[color].length > 0 && color !== "white"
    );

    // Asignar colores a los jugadores
    game.players.forEach((player, index) => {
        const color = availableColors[index];
        player.color = color;
    });

    io.to(gameCode).emit("gameStarted", { gameCode, adjustedPositions, players: game.players });
    callback({ success: true });
  });

  // Desconexión del jugador
  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);

    games = games.filter((game) => {
      game.players = game.players.filter((player) => player.id !== socket.id);
      game.playersJoined -= 1;

      if (game.playersJoined === 0) {
        return false; // Eliminar juego vacío
      }

      return true;
    });

    const availableGames = getAvailableGames();
    if (availableGames.length > 0) {
      io.emit("gamesUpdated", availableGames);
    }
  });
});
