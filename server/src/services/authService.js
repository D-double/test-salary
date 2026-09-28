import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/connection.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';

/**
 * Регистрация нового пользователя
 * @param {Object} data - { username, password }
 * @returns {Promise<Object>} { token, user: { id, username } }
 */
export async function register(data) {
  const db = getDb();
  const { username, password } = data;

  // Валидация
  if (!username || !password) {
    const error = new Error('Имя пользователя и пароль обязательны');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  if (username.length < 3) {
    const error = new Error('Имя пользователя должно быть не менее 3 символов');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('Пароль должен быть не менее 6 символов');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Проверяем, существует ли пользователь
  const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
  if (existingUser) {
    const error = new Error('Пользователь с таким именем уже существует');
    error.statusCode = 409;
    error.code = 'USER_EXISTS';
    throw error;
  }

  // Хешируем пароль
  const passwordHash = await bcrypt.hash(password, 10);

  // Создаём пользователя
  const id = crypto.randomUUID();
  await db.run(
    'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)',
    [id, username, passwordHash]
  );

  // Генерируем JWT-токен
  const token = jwt.sign({ userId: id, username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id,
      username,
    },
  };
}

/**
 * Вход пользователя
 * @param {Object} data - { username, password }
 * @returns {Promise<Object>} { token, user: { id, username } }
 */
export async function login(data) {
  const db = getDb();
  const { username, password } = data;

  // Валидация
  if (!username || !password) {
    const error = new Error('Имя пользователя и пароль обязательны');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Ищем пользователя
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    const error = new Error('Неверное имя пользователя или пароль');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Проверяем пароль
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    const error = new Error('Неверное имя пользователя или пароль');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Генерируем JWT-токен
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}

/**
 * Проверка и декодирование JWT-токена
 * @param {string} token - JWT-токен
 * @returns {Object|null} декодированные данные { userId, username } или null
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      userId: decoded.userId,
      username: decoded.username,
    };
  } catch (error) {
    return null;
  }
}