import express from "express";

import { createUser, getUserByEmail, getUserByNick, getUserByNicknameAndPassword } from "../db/users";
import { authentication, random } from "../helpers"

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        // Log para ver el cuerpo de la solicitud
        console.log(req.body);

        // Verificar si los campos obligatorios están presentes
        if(!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: email, username, o password',
            });
        }

        // Verificar si el correo ya está registrado
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este correo electrónico ya está registrado',
            });
        }

        // Verificar si el correo ya está registrado
        const existingNick = await getUserByNick(username);
        if (existingNick) {
            return res.status(400).json({
                success: false,
                message: 'Este nickname ya está registrado',
            });
        }

        // Crear un nuevo usuario
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        // Enviar una respuesta exitosa con un mensaje personalizado
        return res.status(201).json({
            success: true,
            message: `Usuario ${user.username} registrado con éxito`,
            user: user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Hubo un error al procesar tu solicitud',
        });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;

        console.log('Datos recibidos para login:', req.body);

        // Validamos que se hayan proporcionado ambos campos
        if (!username || !password) {
            console.log('Error: Faltan campos de login');
            return res.status(400).json({ error: 'Faltan campos' });
        }

        // Llamamos a la función de autenticación
        const user = await getUserByNicknameAndPassword(username, password);

        if (!user) {
            console.log(`Error: Usuario o contraseña incorrectos para el usuario ${username}`);
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Si la autenticación es exitosa, devolvemos los datos del usuario (puedes incluir más detalles)
        console.log(`Login exitoso para el usuario ${username}`);
        return res.status(200).json({
            username: user.username,
            email: user.email,
            message: 'Login exitoso',
        });

    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ error: 'Hubo un error al intentar hacer login' });
    }
};