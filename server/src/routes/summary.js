import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Все роуты сводной статистики требуют авторизации
router.use(authenticate);

/**
 * GET /api/v1/summary/balance
 * Получить общий баланс пользователя
 */
router.get('/balance', summaryController.getBalance);

/**
 * GET /api/v1/summary/by-category
 * Получить сумму по категориям пользователя
 * Query params: type (income|expense), dateFrom, dateTo
 */
router.get('/by-category', summaryController.getByCategory);

/**
 * GET /api/v1/summary/by-month
 * Получить помесячную статистику пользователя
 * Query params: months (количество последних месяцев)
 */
router.get('/by-month', summaryController.getByMonth);

export default router;