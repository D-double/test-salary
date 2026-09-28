import * as authService from '../services/authService.js';

/**
 * Регистрация нового пользователя
 * POST /api/v1/auth/register
 */
export async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    const result = await authService.register({ username, password });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Вход пользователя
 * POST /api/v1/auth/login
 */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const result = await authService.login({ username, password });

    res.json(result);
  } catch (error) {
    next(error);
  }
}