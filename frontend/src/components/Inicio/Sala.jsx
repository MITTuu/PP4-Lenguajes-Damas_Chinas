import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { socketManager } from './socketManager';
import "../../assets/Sala.css";

const Sala = () => {
    const { gameCode } = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [gameDetails, setGameDetails] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [creatorSocketId, setCreatorSocketId] = useState(null);
    const [currentPlayerSocketId, setCurrentPlayerSocketId] = useState("");
    const [error, setError] = useState("");

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
            // Obtenien información inicial del juego
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

            socket.on("gameStarted", (startedGameCode) => {
                if (startedGameCode === gameCode) {
                    navigate(`/juego/${gameCode}`);
                }
            });
        };

        setupSocketListeners();

        // Cleanup function
        return () => {
            const socket = socketManager.getSocket();
            if (socket) {
                socket.off("gamesUpdated");
                socket.off("gameUpdated");
                socket.off("playerJoined");
                socket.off("gameError");
                socket.off("gameStarted");
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
        const socket = socketManager.getSocket();
        if (socket && isGameStarted && isCreator()) {
            socket.emit("startGame", gameCode, (response) => {
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
                            Esperando más jugadores... ({players.length}/{gameDetails.numPlayers})
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