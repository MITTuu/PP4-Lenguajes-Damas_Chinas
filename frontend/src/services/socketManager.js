// socketManager.js
import { io } from "socket.io-client";

class SocketManager {
    constructor() {
        this.socket = null;
        this.nickname = null;
        this.isConnected = false;
    }

    connect() {
        if (this.socket) {
            // Si ya existe una conexión, la cerramos
            this.disconnect();
        }

        this.nickname = localStorage.getItem("nickname");
        
        // Crear nueva conexión
        this.socket = io("http://localhost:5000", {
            auth: {
                nickname: this.nickname
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.socket.on("connect", () => {
            console.log("Conectado al servidor con ID:", this.socket.id);
            this.isConnected = true;
        });

        this.socket.on("disconnect", () => {
            console.log("Desconectado del servidor");
            this.isConnected = false;
        });

        // Manejar reconexión
        this.socket.on("reconnect", (attemptNumber) => {
            console.log(`Reconectado después de ${attemptNumber} intentos`);
        });

        // Evento para manejar errores
        this.socket.on("connect_error", (error) => {
            console.error("Error de conexión:", error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Método para verificar si el usuario ya está conectado
    isUserConnected() {
        return this.isConnected;
    }

    // Getter para el socket
    getSocket() {
        return this.socket;
    }
}

// Exportar una única instancia
export const socketManager = new SocketManager();