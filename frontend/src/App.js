import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Encabezado from './components/Inicio/Encabezado';

import Inicio from './components/Inicio/Inicio';
import Sala from './components/Inicio/Sala';
import CrearPartida from './components/Inicio/CrearPartida';
import UnirsePartida from './components/Inicio/UnirsePartida';
import Board from './components/board/Board';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <React.Fragment>
      <Router>
        <Encabezado />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path='/board' element={<Board />} />
          <Route path='/inicio' element={<Inicio />} />
          <Route path='/Crear-partida' element={<CrearPartida />}/>
          <Route path='/unirse' element={<UnirsePartida />}/>
          <Route path="/sala/:gameCode" element={<Sala />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
