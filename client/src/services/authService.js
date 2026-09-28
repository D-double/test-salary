import { post } from './api.js';

// Ключи для localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Регистрация нового пользователя
 * @param {Object} data - { username, password }
 * @returns {Promise<Object>} { token, user }
 */
export async function register(data) {
  try {
    const response = await post('/auth/register', data);

    // Сохраняем токен и информацию о пользователе
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
}

/**
 * Вход пользователя
 * @param {Object} data - { username, password }
 * @returns {Promise<Object>} { token, user }
 */
export async function login(data) {
  try {
    const response = await post('/auth/login', data);

    // Сохраняем токен и информацию о пользователе
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
}

/**
 * Выход пользователя
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Получить текущий токен
 * @returns {string|null} JWT-токен или null
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Получить информацию о текущем пользователе
 * @returns {Object|null} объект пользователя или null
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Ошибка парсинга данных пользователя:', error);
    return null;
  }
}

/**
 * Проверить, авторизован ли пользователь
 * @returns {boolean} true, если есть валидный токен
 */
export function isAuthenticated() {
  const token = getToken();
  return !!token;
}