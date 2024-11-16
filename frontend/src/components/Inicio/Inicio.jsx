import React from "react";
import "./Inicio.css";

const Inicio = () => {
    const titulo = "Damas Chinas";

    return (
        <div className="inicio-container">
            {/* Fondo borroso */}
            <div className="inicio-background"></div>

            {/* Título con letras animadas */}
            <h1 className="inicio-title">
                {titulo.split("").map((letra, index) => (
                    <span key={index} className="titulo-letra" style={{ animationDelay: `${index * 0.1}s` }}>
                        {letra}
                    </span>
                ))}
            </h1>

            {/* Opciones del juego */}
            <div className="inicio-options">
                <button className="inicio-button">Crear partida</button>
                <button className="inicio-button">Unirse al juego</button>
                <button className="inicio-button">Ver ranking</button>
            </div>
        </div>
    );
};

export default Inicio;
