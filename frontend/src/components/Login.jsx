import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';  
import '../assets/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica de campos vacíos
        if (!username || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor ingresa tu nombre de usuario y contraseña.',
            });
            return;
        }

        try {
            const response = await loginUser({ username, password });
            console.log("User logged in:", response);

            // Verificar si el login fue exitoso
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido nuevamente!',
                    showConfirmButton: false,
                    timer: 1500 
                }).then(() => {
                    // Redirige a la página principal 
                });
            } else {
                // Si el servidor devuelve un mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: response.message,
                });
            }
        } catch (error) {
            console.error("Error logging in:", error);

            // Captura y muestra el mensaje de error desde la API si lo hay
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un problema al intentar iniciar sesión. Intenta nuevamente.',
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Inicio de Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Iniciar sesión</button>
                </form>
                <div className="register-prompt">
                    <p>No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;