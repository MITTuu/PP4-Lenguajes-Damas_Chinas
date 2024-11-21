import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ranking';

// Interfaz para los datos del ranking
interface RankingData {
  gameId: string;
  winner: string;
  gameType: string;
  creator: string;
}

// Interfaz para la respuesta de la API
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Método POST para guardar una nueva entrada en el ranking
const postRanking = async (rankingData: RankingData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}`, rankingData);
    return { success: true, data: response.data };
  } catch (error: any) {
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

export { postRanking };
