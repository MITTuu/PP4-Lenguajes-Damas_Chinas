const { io } = require("socket.io-client");

// Conéctate al servidor (asegúrate de usar la misma URL)
const socket = io("http://localhost:4000");  // Cambiar el puerto de 3000 a 4000


// Escucha actualizaciones del servidor
socket.on("update-board", (boardState) => {
  console.log("Estado del tablero actualizado:", boardState);
});

// Envía un movimiento de prueba
socket.emit("move-chip", {
  newPositions: { green: [[4, 16]] }, // Cambia los datos según tu lógica
  newTurn: "green",
});

socket.on("connect", () => {
  console.log("Conectado al servidor.");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor.");
});
