import express from 'express';

import { register, login } from '../controllers/userController';

export default (router: express.Router) => {
    // Ruta para registrar un nuevo usuario
    router.post('/api/auth/register', (req, res, next) => {
        register(req, res).catch(next);
    });

    // Ruta para hacer login de un usuario existente
    router.post('/api/auth/login', (req, res, next) => {
        login(req, res).catch(next);
    });
};
