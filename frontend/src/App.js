import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Board from './components/Pruebas/Board';
import Grid from './components/Grid';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/board' element={<Board />} />
          <Route path='/grid' element={<Grid />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
