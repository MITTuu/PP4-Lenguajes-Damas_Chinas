import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ranking';

// Método POST para guardar una nueva entrada en el ranking
export const postRanking = async (rankingData) => {
    try {
        const response = await axios.post(`${API_URL}`, rankingData);
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

// Método GET para obtener todos los rankings
export const getRankings = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
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

