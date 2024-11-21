import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NicknameModal from './NicknameModal';
import "../../assets/Inicio.css";

const Inicio = () => {
    const titulo = "Damas Chinas";
    const navigate = useNavigate();

    const [nickname, setNickname] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');

    const handleCrearPartida = () => {
        if (!nickname) {
            setAction('crear'); // Establecer la acción como 'crear'
            setShowModal(true);  // Si no hay nickname, mostramos el modal
        } else {
            navigate("/crear-partida");
        }
    };

    const handleUnirseAPartida = () => {
        if (!nickname) {
            setAction('unirse'); // Establecer la acción como 'unirse'
            setShowModal(true);  // Si no hay nickname, mostramos el modal
        } else {
            navigate("/unirse");
        }
    };

    const handleAuthenticate = (nickname) => {
        setNickname(nickname);
        localStorage.setItem("nickname", nickname);
        if (action === 'crear') {
            navigate("/crear-partida"); // Redirigir a crear partida
        } else if (action === 'unirse') {
            navigate("/unirse"); // Redirigir a unirse a partida
        }
    };

    const handleVerRanking = () => {
        navigate("/ranking");
    };

    return (
        <div className="inicio-container">
            <div className="inicio-background"></div>
            <h1 className="inicio-title">
                {titulo.split("").map((letra, index) => (
                    <span key={index} className="titulo-letra" style={{ animationDelay: `${index * 0.1}s` }}>
                        {letra}
                    </span>
                ))}
            </h1>
            <div className="inicio-options">
                <button className="inicio-button" onClick={handleCrearPartida}>Crear partida</button>
                <button className="inicio-button" onClick={handleUnirseAPartida}>Unirse al juego</button>
                <button className="inicio-button" onClick={handleVerRanking}>Ver ranking</button>
            </div>
            <NicknameModal 
                onAuthenticate={handleAuthenticate}
                show={showModal}
                onHide={() => setShowModal(false)}  // Cierra el modal
            />
        </div>
    );
};

export default Inicio;
