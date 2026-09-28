// Базовый URL из .env (Vite подхватывает автоматически)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Ключ для хранения токена в localStorage
const TOKEN_KEY = 'auth_token';

/**
 * Базовая функция для выполнения HTTP-запросов
 * @param {string} path - путь API (например, '/incomes')
 * @param {Object} options - настройки запроса (method, body, params)
 * @returns {Promise<any>} данные из ответа
 */
async function request(path, options = {}) {
  // Формируем полный URL
  const url = `${BASE_URL}${path}`;

  // Добавляем query-параметры, если они есть
  let finalUrl = url;
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    finalUrl = `${url}?${searchParams.toString()}`;
  }

  // Получаем токен из localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  // Формируем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Добавляем токен авторизации, если он есть
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Выполняем запрос
    const response = await fetch(finalUrl, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Проверяем HTTP-статус (если ошибка — пробуем прочитать тело)
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Если не удалось распарсить JSON
        errorData = { error: { message: response.statusText || 'HTTP ошибка' } };
      }

      if (errorData.error) {
        const error = new Error(errorData.error.message || 'Произошла ошибка');
        error.code = errorData.error.code || 'UNKNOWN_ERROR';
        error.status = response.status;
        throw error;
      }

      const error = new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    // Если статус 204 No Content или тело пустое — возвращаем undefined
    if (response.status === 204) {
      return undefined;
    }

    // Читаем текст ответа
    const text = await response.text();

    // Если тело пустое — возвращаем undefined
    if (!text) {
      return undefined;
    }

    // Парсим JSON
    const data = JSON.parse(text);

    // Проверяем, есть ли ошибка в ответе
    if (data.error) {
      const error = new Error(data.error.message || 'Произошла ошибка');
      error.code = data.error.code || 'UNKNOWN_ERROR';
      error.status = response.status;
      throw error;
    }

    // Возвращаем данные (если есть поле data — возвращаем его, иначе весь ответ)
    return data.data !== undefined ? data : data;
  } catch (error) {
    // Обработка ошибок сети
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Ошибка сети: не удалось подключиться к серверу');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    throw error;
  }
}

/**
 * GET-запрос
 * @param {string} path - путь API
 * @param {Object} params - query-параметры
 * @returns {Promise<any>} данные из ответа
 */
export function get(path, params = {}) {
  return request(path, { method: 'GET', params });
}

/**
 * POST-запрос
 * @param {string} path - путь API
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function post(path, body) {
  return request(path, { method: 'POST', body });
}

/**
 * PUT-запрос
 * @param {string} path - путь API
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function put(path, body) {
  return request(path, { method: 'PUT', body });
}

/**
 * DELETE-запрос
 * @param {string} path - путь API
 * @returns {Promise<any>} данные из ответа
 */
export function del(path) {
  return request(path, { method: 'DELETE' });
}

export default { get, post, put, del };