import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socketManager } from '../../services/socketManager';
import '../../assets/unirsePartida.css';
const UnirsePartida = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joiningGame, setJoiningGame] = useState(false);

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
            socket.on("connect", () => {
                console.log("Conectado al servidor");
                fetchAvailableGames();
            });

            socket.on("connect_error", () => {
                setError("Error de conexión con el servidor");
                setIsLoading(false);
            });

            socket.on("gamesUpdated", (updatedGames) => {
                console.log("Salas actualizadas recibidas:", updatedGames);
                const availableRooms = updatedGames.filter(room => 
                    !room.isStarted && room.playersJoined < room.numPlayers
                );
                setRooms(availableRooms);
                setIsLoading(false);
            });
        };

        setupSocketListeners();
        fetchAvailableGames();

        return () => {
            const socket = socketManager.getSocket();
            if (socket) {
                socket.off("connect");
                socket.off("connect_error");
                socket.off("gamesUpdated");
            }
        };
    }, [navigate]);

    const fetchAvailableGames = () => {
        const socket = socketManager.getSocket();
        if (!socket) {
            setError("No hay conexión con el servidor");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        socket.emit("getAvailableGames", (response) => {
            if (response.success) {
                console.log("Salas disponibles recibidas:", response.games);
                setRooms(response.games);
            } else {
                console.log("No hay salas disponibles");
                setRooms([]);
            }
            setIsLoading(false);
        });
    };

    const handleJoinGame = (gameCode) => {
        const socket = socketManager.getSocket();
        if (!socket) {
            setError("No hay conexión con el servidor");
            return;
        }

        const nickname = localStorage.getItem("nickname");
        if (!nickname) {
            setError("Debes iniciar sesión primero");
            navigate("/");
            return;
        }

        setJoiningGame(true);
        setError(null);

        // Al unirse, guardamos la información del juego en localStorage
        const gameInfo = rooms.find(room => room.gameCode === gameCode);
        if (gameInfo) {
            localStorage.setItem('currentGame', JSON.stringify(gameInfo));
        }

        socket.emit("joinGame", { gameCode, nickname }, (response) => {
            setJoiningGame(false);
            if (response.success) {
                // Guardamos la información actualizada del juego
                localStorage.setItem('currentGame', JSON.stringify(response.game));
                navigate(`/sala/${gameCode}`);
            } else {
                setError(response.message || "No se pudo unir a la partida");
                localStorage.removeItem('currentGame');
            }
        });
    };

    return (
        <div className="unirse-partida-container">
            <h1 className="unirse-title">Salas disponibles</h1>
            
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)} className="close-error">×</button>
                </div>
            )}

            <div className="controls">
                <button 
                    onClick={fetchAvailableGames} 
                    className="refresh-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Actualizando..." : "Actualizar salas"}
                </button>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando salas disponibles...</p>
                </div>
            ) : rooms.length > 0 ? (
                <div className="rooms-list">
                    {rooms.map((room) => (
                        <div key={room.gameCode} className="room-card">
                            <div className="room-info">
                                <h3>Sala: {room.gameCode}</h3>
                                <p className="room-status">
                                    Jugadores: {room.playersJoined}/{room.numPlayers}
                                </p>
                                <p className="room-creator">  
                                    Creador: {room.players?.[0]?.nickname || "Desconocido"}
                                </p>
                                <p className="game-type">
                                    Tipo: {room.gameType === "vsTiempo" ? "Vs Tiempo" : "Normal"}
                                    {room.gameTime && ` (${room.gameTime} min)`}
                                </p>
                            </div>
                            <button 
                                onClick={() => handleJoinGame(room.gameCode)}
                                disabled={joiningGame || room.isStarted || room.playersJoined >= room.numPlayers}
                                className={`join-button ${joiningGame ? 'joining' : ''}`}
                            >
                                {joiningGame ? "Uniéndose..." : "Unirse"}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-rooms">
                    <p>No hay salas disponibles en este momento.</p>
                    <p>Puedes crear una nueva sala o esperar a que se creen nuevas salas.</p>
                </div>
            )}
        </div>
    );
};

export default UnirsePartida;