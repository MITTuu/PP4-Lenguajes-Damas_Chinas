import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message,
            };
        } else if (error.request) {
            return {
                success: false,
                message: 'No se recibió respuesta del servidor',
            };
        } else {
            return {
                success: false,
                message: `Error al realizar la solicitud: ${error.message}`,
            };
        }
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data.message,
            };
        } else if (error.request) {
            return {
                success: false,
                message: 'No se recibió respuesta del servidor',
            };
        } else {
            return {
                success: false,
                message: `Error al realizar la solicitud: ${error.message}`,
            };
        }
    }
};
