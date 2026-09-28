import { Router } from 'express';
import * as incomeController from '../controllers/incomeController.js';
import { validateTransactionMiddleware } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Все роуты доходов требуют авторизации
router.use(authenticate);

/**
 * GET /api/v1/incomes
 * Получить все доходы пользователя с пагинацией и фильтрами
 */
router.get('/', incomeController.getAllIncomes);

/**
 * GET /api/v1/incomes/:id
 * Получить доход пользователя по ID
 */
router.get('/:id', incomeController.getIncomeById);

/**
 * POST /api/v1/incomes
 * Создать новый доход для пользователя
 */
router.post(
  '/',
  validateTransactionMiddleware('income'),
  incomeController.createIncome
);

/**
 * PUT /api/v1/incomes/:id
 * Обновить существующий доход пользователя
 */
router.put(
  '/:id',
  validateTransactionMiddleware('income'),
  incomeController.updateIncome
);

/**
 * DELETE /api/v1/incomes/:id
 * Удалить доход пользователя по ID
 */
router.delete('/:id', incomeController.deleteIncome);

export default router;