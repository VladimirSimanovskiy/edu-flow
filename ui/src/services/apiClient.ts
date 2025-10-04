import axios from 'axios';

/**
 * API клиент для работы с backend
 */
export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
	config => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response?.status === 401) {
			// Токен истек, перенаправляем на страницу входа
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
