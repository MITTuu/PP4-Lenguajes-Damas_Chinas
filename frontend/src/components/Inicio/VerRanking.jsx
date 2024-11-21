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
            <table border="1">
                <thead>
                <tr>
                <th>Game ID</th>
                <th>Winner</th>
                <th>Game Type</th>
                <th>Creator</th>
                <th>Date</th>
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
  );
};

export default VerRanking;
