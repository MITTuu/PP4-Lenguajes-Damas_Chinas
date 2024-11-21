import React, { useEffect, useState } from "react";
import { getRankings } from "../../services/api";
import "../../assets/verRanking.css";

const VerRanking = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true); 
                const response = await getRankings(); 
                setRankings(response);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener los rankings:", err);
                setError("No se pudieron cargar los rankings. Inténtalo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return <p>Cargando rankings...</p>; 
    }

    if (error) {
        return <p>{error}</p>; 
    }

    return (
        <div className="ranking-container">
            {/* Contenedor para el título */}
            <div className="ranking-title-container">
                <h1 className="ranking-title">
                    {"Ranking de Partidas".split("").map((letra, index) => (
                    <span 
                        key={index} 
                        className="ranking-letra" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {letra}
                    </span>
                ))}
                </h1>
            </div>
            
            {/* Contenedor para la tabla */}
            <div className="ranking-table-container">
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID Partida</th>
                            <th>Ganador</th>
                            <th>Tipo de juego</th>
                            <th>Creador</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((ranking) => (
                            <tr key={ranking._id}>
                                <td>{ranking.gameId}</td>
                                <td>{ranking.winner}</td>
                                <td>{ranking.gameType}</td>
                                <td>{ranking.creator}</td>
                                <td>{new Date(ranking.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerRanking;
