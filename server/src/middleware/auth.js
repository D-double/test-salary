import { verifyToken } from '../services/authService.js';

/**
 * Middleware для проверки JWT-токена
 * Извлекает токен из заголовка Authorization, проверяет его валидность
 * и добавляет информацию о пользователе в req.user
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} next - функция next() Express
 */
export function authenticate(req, res, next) {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('Токен авторизации не предоставлен');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }

  // Формат: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    const error = new Error('Неверный формат токена авторизации');
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN_FORMAT';
    return next(error);
  }

  const token = parts[1];

  // Проверяем токен
  const userData = verifyToken(token);
  if (!userData) {
    const error = new Error('Невалидный или истёкший токен');
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN';
    return next(error);
  }

  // Добавляем информацию о пользователе в запрос
  req.user = userData;
  next();
}