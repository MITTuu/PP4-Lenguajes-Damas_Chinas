import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { socketManager } from '../../services/socketManager';
import "../../assets/crearPartida.css";

const CrearPartida = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [gameType, setGameType] = useState("vs");
    const [numPlayers, setNumPlayers] = useState(2);
    const [gameTime, setGameTime] = useState(5);
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const storedNickname = localStorage.getItem("nickname");
        if (!storedNickname) {
            navigate("/");
            return;
        }
        setNickname(storedNickname);

        if (!socketManager.isUserConnected()) {
            socketManager.connect();
        }

        const socket = socketManager.getSocket();
        
        socket.on('gameCreated', (data) => {
            console.log('Partida creada:', data);
            if (data.gameCode) {
                setGameCode(data.gameCode);
                navigate(`/sala/${data.gameCode}`);
            }
        });

        socket.on('gameCreationError', (error) => {
            console.error('Error al crear la partida:', error);
            setError(error.message || 'Error al crear la partida');
        });

        return () => {
            const socket = socketManager.getSocket();
            if (socket) {
                socket.off('gameCreated');
                socket.off('gameCreationError');
            }
        };
    }, [navigate]);

    const handleCreateGame = () => {
        setError("");
        
        if (!gameType || !numPlayers || (gameType === "vsTiempo" && !gameTime)) {
            setError("Por favor completa todos los campos");
            return;
        }

        // Generar un código único para la partida
        const generatedGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Crea el objeto de configuración que coincida con lo que espera el servidor
        const gameConfig = {
            gameCode: generatedGameCode,
            numPlayers: numPlayers,
            creator: nickname,
            gameType: gameType,
            gameTime: gameType === "vsTiempo" ? gameTime : null
        };

        const socket = socketManager.getSocket();
        if (!socket || !socket.connected) {
            setError("No hay conexión con el servidor. Intentando reconectar...");
            socketManager.connect();
            return;
        }

        // Emitir el evento con la estructura correcta y manejar la respuesta
        socket.emit("createGame", gameConfig, (response) => {
            if (response && response.success) {
                setGameCode(response.game.gameCode);
                navigate(`/sala/${response.game.gameCode}`);
            } else {
                setError(response?.message || "Error al crear la partida");
            }
        });
    };

    return (
        <div className="inicio-container">
            <div className="inicio-background"></div>

            <h1 className="inicio-title">
                {"Crear Partida".split("").map((letra, index) => (
                    <span 
                        key={index} 
                        className="titulo-letra" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {letra}
                    </span>
                ))}
            </h1>

            <div className="content-container">
                <div className="form-container">
                    <div className="nickname-container">
                        <p><strong>Nickname del creador:</strong> {nickname}</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de juego</Form.Label>
                            <Form.Select
                                value={gameType}
                                onChange={(e) => setGameType(e.target.value)}
                                disabled={!!gameCode}
                            >
                                <option value="vs">Vs</option>
                                <option value="vsTiempo">Vs Tiempo</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad de jugadores</Form.Label>
                            <Form.Select
                                value={numPlayers}
                                onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                                disabled={!!gameCode}
                            >
                                <option value={2}>2 jugadores</option>
                                <option value={3}>3 jugadores</option>
                                <option value={4}>4 jugadores</option>
                                <option value={6}>6 jugadores</option>
                            </Form.Select>
                        </Form.Group>

                        {gameType === "vsTiempo" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Tiempo para la partida</Form.Label>
                                <Form.Select
                                    value={gameTime}
                                    onChange={(e) => setGameTime(parseInt(e.target.value))}
                                    disabled={!!gameCode}
                                >
                                    <option value={5}>5 minutos</option>
                                    <option value={10}>10 minutos</option>
                                    <option value={15}>15 minutos</option>
                                    <option value={20}>20 minutos</option>
                                    <option value={30}>30 minutos</option>
                                </Form.Select>
                            </Form.Group>
                        )}

                        <Button 
                            variant="primary" 
                            onClick={handleCreateGame} 
                            disabled={!!gameCode}
                        >
                            Crear partida
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CrearPartida;