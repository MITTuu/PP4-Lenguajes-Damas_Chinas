import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { socketManager } from '../../services/socketManager';
import "../../assets/Sala.css";

const Sala = () => {
    const { gameCode } = useParams();
    const navigate = useNavigate();
    // Obtiene la información inicial del localStorage
    const initialGameInfo = JSON.parse(localStorage.getItem('currentGame') || 'null');
    
    const [players, setPlayers] = useState(initialGameInfo?.players || []);
    const [gameDetails, setGameDetails] = useState(initialGameInfo);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [creatorSocketId, setCreatorSocketId] = useState(initialGameInfo?.creator || null);
    const [currentPlayerSocketId, setCurrentPlayerSocketId] = useState("");
    const [error, setError] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // Tiempo restante en segundos

    useEffect(() => {
        const nickname = localStorage.getItem("nickname");
        if (!nickname) {
            navigate("/");
            return;
        }

        if (!socketManager.isUserConnected()) {
            socketManager.connect();
        }

        const socket = socketManager.getSocket();
        
        const setupSocketListeners = () => {
            // Obtiene información inicial del juego
            socket.emit("getGameInfo", gameCode, (response) => {
                if (response.success) {
                    updateGameState(response.game);
                } else {
                    setError(response.message || "No se pudo obtener la información del juego");
                }
            });

            // Escucha actualizaciones de los juegos
            socket.on("gamesUpdated", (updatedGames) => {
                const currentGame = updatedGames.find(game => game.gameCode === gameCode);
                if (currentGame) {
                    updateGameState(currentGame);
                }
            });

            // Escucha actualizaciones específicas del juego
            socket.on("gameUpdated", (updatedGame) => {
                if (updatedGame.gameCode === gameCode) {
                    updateGameState(updatedGame);
                }
            });

            // Escucha cuando un jugador se une
            socket.on("playerJoined", (updatedGame) => {
                if (updatedGame.gameCode === gameCode) {
                    updateGameState(updatedGame);
                }
            });

            socket.on("gameError", (errorMessage) => {
                setError(errorMessage);
            });

            socket.on("gameStarted", (data) => {
                const { gameCode } = data;
            
                if (gameCode) {
                    navigate(`/juego/${gameCode}`);
                }
            });
        };

        socket.on("allGamesClosed", () => {
            setError("No hay salas disponibles en este momento.");
            navigate("/");
        });
    

        setupSocketListeners();

        // Temporizador para manejar la expiración de la sala
        const countdownInterval = setInterval(() => {
            setTimeLeft((prevTime) => {
                console.log(`Tiempo restante: ${prevTime - 1} segundos`);
                return prevTime - 1;
            });
        }, 1000);

        // Establece el tiempo de expiración a 180 segundos (3 minutos)
        const expirationTime = 180; // 3 minutos en segundos

        const expirationTimeout = setTimeout(() => {
            setIsExpired(true);
            clearInterval(countdownInterval); // Detener el intervalo cuando la sala expire
            socket.emit("expireGame", gameCode); // Notificar al servidor que esta sala ha expirado
            socket.emit("closeAllGames"); // Notificar al servidor para cerrar todas las salas
        }, expirationTime * 1000); // Convertir a milisegundos
    
        return () => {
            clearTimeout(expirationTimeout);
            clearInterval(countdownInterval);
            if (socket) {
                socket.off("gamesUpdated");
                socket.off("gameUpdated");
                socket.off("playerJoined");
                socket.off("gameError");
                socket.off("gameStarted");
                socket.off("allGamesClosed");
            }
        };
    }, [gameCode, navigate]);

    const updateGameState = (game) => {
        if (!game) return;
        
        setGameDetails(game);
        setPlayers(game.players || []);
        setCreatorSocketId(game.creator);
        setCurrentPlayerSocketId(socketManager.getSocket()?.id || "");
        
        // Actualiza el estado de inicio del juego basado en el número de jugadores
        const isFull = game.players?.length === game.numPlayers;
        setIsGameStarted(isFull);
    };

    const handleStartGame = () => {
        console.log("Iniciando juego...");
        const socket = socketManager.getSocket();
        if (socket && isGameStarted && isCreator()) {
            socket.emit("startGame", gameCode, (response) => {
                console.log(response);
                if (!response.success) {
                    setError(response.message || "No se pudo iniciar el juego");
                }
            });
        }
    };

    const isCreator = () => {
        const socket = socketManager.getSocket();
        return socket && socket.id === creatorSocketId;
    };

    if (error) {
        return (
            <div className="sala-container">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <Button variant="secondary" onClick={() => navigate("/")}>
                    Volver al inicio
                </Button>
            </div>
        );
    }

    return (
        <div className="sala-container">
            <h1>Información de la Sala</h1>
            {gameDetails ? (
                <>
                    <p>Tiempo restante: {timeLeft} segundos</p>
                    <p><strong>Código de la partida:</strong> {gameCode}</p>
                    <p><strong>Tipo de juego:</strong> {gameDetails.gameType}</p>
                    <p><strong>Jugadores actuales:</strong> {players.length}/{gameDetails.numPlayers}</p>

                    <div className="players-list">
                        <h3>Jugadores en la sala:</h3>
                        <ul>
                            {players.map((player, index) => (
                                <li 
                                    key={player.id} 
                                    className={`player-item ${player.id === creatorSocketId ? 'creator' : ''}`}
                                >
                                    {player.nickname} 
                                    {player.id === creatorSocketId && " (Creador)"}
                                    {player.id === currentPlayerSocketId && " (Tú)"}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isGameStarted && isCreator() && (
                        <Button 
                            variant="primary" 
                            onClick={handleStartGame}
                            className="start-game-button"
                        >
                            Iniciar Juego
                        </Button>
                    )}

                    {!isGameStarted && (
                        <p className="waiting-message">
                            {players.length === gameDetails.numPlayers
                                ? "Esperando a que el creador inicie la partida..."
                                : `Esperando más jugadores... (${players.length}/${gameDetails.numPlayers})`}
                        </p>
                    )}
                </>
            ) : (
                <div className="loading-container">
                    <p>Cargando detalles de la sala...</p>
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Sala;
