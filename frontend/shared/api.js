// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Funções da API
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Erro: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show(error.message, 'error');
        }
        throw error;
    }
}
