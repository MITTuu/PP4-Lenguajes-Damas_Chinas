import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';  
import '../assets/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica de campos vacíos
        if (!username || !password || !email) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos antes de registrarte.',
            });
            return;
        }

        try {
            const response = await registerUser({ username, password, email });

            // Verifica si la respuesta es exitosa
            if (response.success) {
                console.log("User registered:", response);

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Registro Exitoso!',
                    text: 'Tu cuenta ha sido creada con éxito.',
                    showConfirmButton: false,
                    timer: 1500 
                }).then(() => {
                    // Redirigir a la página de login después de mostrar el mensaje
                    navigate('/login');
                });
            } else {
                // Si el servidor devuelve un mensaje de error personalizado
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Hubo un problema al registrar tu cuenta. Intenta nuevamente.',
                });
            }
        } catch (error) {
            console.error("Error registering:", error);

            // Captura y muestra el mensaje de error desde la API si lo hay
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un problema al registrar tu cuenta. Intenta nuevamente.',
            });
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Registrarse</h2>
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
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Registarse</button>
                </form>
                <div className="login-prompt">
                    <p>Ya tienes una cuenta? <Link to="/login">Inicia Sesión aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
