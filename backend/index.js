const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: {
    origin: "*",
  },
});

let games = [];

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("createGame", (gameConfig, callback) => {
    console.log("Datos recibidos en createGame:", gameConfig);

    if (!callback || typeof callback !== "function") {
      console.error("Callback no proporcionado o no es una función");
      return;
    }

    const { gameCode, numPlayers, creator, gameType, gameTime } = gameConfig;

    if (!gameCode || !numPlayers || !creator) {
      return callback({
        success: false,
        message: "Faltan datos necesarios para crear la partida"
      });
    }

    const existingGame = games.find((game) => game.gameCode === gameCode);
    
    if (existingGame) {
      callback({ success: false, message: "El código de la sala ya existe" });
    } else {
      const newGame = {
        gameCode,
        numPlayers,
        creator: socket.id,
        players: [{ id: socket.id, nickname: creator }],
        playersJoined: 1, // Inicializamos el contador de jugadores
        gameType,
        gameTime,
        isStarted: false,
      };
      
      games.push(newGame);
      socket.join(gameCode);
      callback({ success: true, game: newGame });
      
      // Solo emitimos actualizacion si hay salas disponibles
      const availableGames = getAvailableGames();
      if (availableGames.length > 0) {
        io.emit("gamesUpdated", availableGames);
      }
    }
  });

  // Función auxiliar para obtener salas disponibles
  const getAvailableGames = () => {
    return games.filter(game => 
      !game.isStarted && 
      game.playersJoined < game.numPlayers
    );
  };

  socket.on("getAvailableGames", (callback) => {
    const availableGames = getAvailableGames();
    // Solo enviamos la respuesta si hay salas disponibles
    if (availableGames.length > 0) {
      console.log("Enviando salas disponibles:", availableGames);
      callback({
        success: true,
        games: availableGames
      });
    } else {
      callback({
        success: false,
        message: "No hay salas disponibles",
        games: []
      });
    }
  });

  socket.on("joinGame", ({ gameCode, nickname }, callback) => {
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

    game.players.push({ id: socket.id, nickname });
    game.playersJoined += 1;
    
    socket.join(gameCode);
    
    // Emitir evento de jugador unido a todos en la sala
    io.to(gameCode).emit("playerJoined", game);
    
    callback({ success: true, game });

    // Actualiza lista de juegos disponibles si aún hay espacio
    const availableGames = getAvailableGames();
    if (availableGames.length > 0) {
        io.emit("gamesUpdated", availableGames);
    }
});
  

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);
    
    // Actualiza las salas cuando un jugador se desconecta
    const playerGames = games.filter(game => 
      game.players.some(player => player.id === socket.id)
    );

    playerGames.forEach(game => {
      game.players = game.players.filter(player => player.id !== socket.id);
      game.playersJoined -= 1;

      // Si la sala queda vacia, la eliminamos
      if (game.playersJoined === 0) {
        games = games.filter(g => g.gameCode !== game.gameCode);
      }
    });

    // Solo emitimos actualización si hay salas disponibles
    const availableGames = getAvailableGames();
    if (availableGames.length > 0) {
      io.emit("gamesUpdated", availableGames);
    }
  });
});