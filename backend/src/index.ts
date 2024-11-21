import { Server, Socket } from "socket.io";
const { getAdjustedPositions } = require("./game/utils/positions");
const { checkWinnerTimeOff, checkWinner } = require("./game/utils/checkWin");
import { postRanking } from './services/api';
import { Game, GameConfig, Player } from "./types/gameTypes";

import mongoose from "mongoose";
import router from './router';

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';


const app = express();
app.use(cors({
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


const MONGO_URL = 'mongodb+srv://mittuu:BxTmQw8MZ7HT94YG@cluster0.frjhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongo = async () => {
  try {
      await mongoose.connect(MONGO_URL);
      console.log('Conectado a MongoDB exitosamente');
  } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      process.exit(1); // Salir del proceso si falla la conexión
  }
};

// Crea el servidor HTTP
const server = http.createServer(app);

// Crear instancia de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Permite todas las conexiones
  }
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
        creatorName: creator,
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

  // Evento para cerrar todos los juegos
  socket.on("closeAllGames", () => {
    console.log("Cerrando todos los juegos...");

    // Eliminar todos los juegos
    games = [];

    // Notificar a todos los clientes que se han cerrado todos los juegos
    io.emit("gamesUpdated", []);

    console.log("Todos los juegos han sido cerrados.");
  });
 
  

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

    // Generar las posiciones iniciales
    const adjustedPositions = getAdjustedPositions(game.numPlayers);

    // Asignar colores y posiciones a los jugadores
    const availableColors = Object.keys(adjustedPositions).filter(
        (color) => adjustedPositions[color].length > 0 && color !== "white"
    );

    game.players.forEach((player, index) => {
        player.color = availableColors[index];
    });

    // Guardar las posiciones en el juego
    game.positions = adjustedPositions;

    game.turn = game.players[0].nickname;

    io.to(gameCode).emit("gameStarted", {
        gameCode,
        players: game.players,
    });

    callback({ success: true });
  });

  socket.on("getGameState", (gameCode: string, callback: (response: { success: boolean; game?: Game; message?: string }) => void) => {
    const game = games.find((g) => g.gameCode === gameCode);

    if (!game) {
        return callback({ success: false, message: "Juego no encontrado" });
    }

    callback({ success: true, game });
  });

  socket.on("validateMove", ({ gameCode, fromRow, fromCol, toRow, toCol, chipColor }, callback) => {
    const game = games.find((g) => g.gameCode === gameCode);
  
    if (!game) {
      return callback({ success: false, message: "Juego no encontrado" });
    }
  
    const player = game.players.find((p) => p.id === socket.id);
  
    if (!player) {
      return callback({ success: false, message: "Jugador no encontrado en el juego" });
    }
  
    if (!player.color || !game.positions) {
      return callback({ success: false, message: "Configuración del juego no válida" });
    }
  
    // Validar que es el turno del jugador
    if (game.turn !== player.nickname) {
      return callback({ success: false, message: "No es tu turno" });
    }
  
    // Validar que la ficha seleccionada pertenece al jugador
    const fromChip = game.positions[chipColor]?.some(
      ([row, col]) => row === fromRow && col === fromCol
    );
    if (!fromChip) {
      return callback({ success: false, message: "No puedes mover esta ficha" });
    }
  
    // Validar que el destino es una ficha blanca
    const toChip = game.positions.white?.some(([row, col]) => row === toRow && col === toCol);
    if (!toChip) {
      return callback({ success: false, message: "Movimiento inválido" });
    }
  
    // Actualiza las posiciones en el juego
    game.positions[chipColor] = game.positions[chipColor].filter(
      ([row, col]) => !(row === fromRow && col === fromCol)
    );
    game.positions[chipColor].push([toRow, toCol]);
  
    game.positions.white = game.positions.white.filter(
      ([row, col]) => !(row === toRow && col === toCol)
    );
    game.positions.white.push([fromRow, fromCol]);

    // Pasar al siguiente turno
    const currentIndex = game.players.findIndex((p) => p.nickname === game.turn);
    const nextIndex = (currentIndex + 1) % game.players.length;
    game.turn = game.players[nextIndex].nickname;

    io.to(gameCode).emit("gameStateUpdated", { newPositions: game.positions, nextTurn: game.turn });

    // Chequear si hay ganador
    const winnerColor = checkWinner(game.positions);

    if (winnerColor) {
      game.winner = player.nickname;

      const rankingData = {
        gameId: game.gameCode,
        winner: game.winner,
        gameType: game.gameType || "Indefinido",
        creator: game.creatorName
    };

    postRanking(rankingData).then((response) => {
      if (response.success) {
        console.log('Ranking guardado:', response);
      } else {
        console.log('Error guardando el ranking:', response.message);
      }
    });

    io.to(gameCode).emit("Winner", { game: game });
    }

    // Confirmar el movimiento al cliente
    callback({ success: true, newPositions: game.positions, nextTurn: game.turn });
  });

  socket.on("checkWinnerTimeOff", ({ gameCode }, callback) => {
    const game = games.find((g) => g.gameCode === gameCode);
  
    if (!game) {
      return callback({ success: false, message: "Juego no encontrado" });
    }
  
    // Chequear si hay ganador
    const winnerColor = checkWinnerTimeOff(game.positions);
  
    if (winnerColor) {
      // Buscar el jugador con el color ganador
      const winnerPlayer = game.players.find((player) => player.color === winnerColor);
  
      if (!winnerPlayer) {
        return callback({ success: false, message: "No se pudo determinar el ganador" });
      }
  
      // Asignar el nickname del ganador
      game.winner = winnerPlayer.nickname;
  
      // Crear y enviar los datos del ranking
      const rankingData = {
        gameId: game.gameCode,
        winner: game.winner,
        gameType: game.gameType || "Indefinido",
        creator: game.creatorName,
      };
  
      postRanking(rankingData).then((response) => {
        if (response.success) {
          console.log("Ranking guardado:", response);
        } else {
          console.log("Error guardando el ranking:", response.message);
        }
      });
  
      // Notificar al resto de los jugadores sobre el ganador
      io.to(gameCode).emit("Winner", { game: game });
    }
  
    // Responder al cliente con éxito
    callback({ success: true, game: game });
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

// Conexión a MongoDB y luego iniciar el servidor
connectToMongo().then(() => {
  server.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
  });
});

app.use('/', router());