import React from "react";
import logo from '../../assets/images/puzzle-svgrepo-com.svg';
import "../../assets/Encabezado.css";

const Encabezado = () => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="encabezado">
      <div className="logo" onClick={handleLogoClick}>
        <img src={logo} alt="Logo Damas Chinas" className="logo-img" />
        <h1>Juegos de mesa</h1>
      </div>
    </header>
  );
};

export default Encabezado;


