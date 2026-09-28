import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateTransactionMiddleware } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Все роуты расходов требуют авторизации
router.use(authenticate);

/**
 * GET /api/v1/expenses
 * Получить все расходы пользователя с пагинацией и фильтрами
 */
router.get('/', expenseController.getAllExpenses);

/**
 * GET /api/v1/expenses/:id
 * Получить расход пользователя по ID
 */
router.get('/:id', expenseController.getExpenseById);

/**
 * POST /api/v1/expenses
 * Создать новый расход для пользователя
 */
router.post(
  '/',
  validateTransactionMiddleware('expense'),
  expenseController.createExpense
);

/**
 * PUT /api/v1/expenses/:id
 * Обновить существующий расход пользователя
 */
router.put(
  '/:id',
  validateTransactionMiddleware('expense'),
  expenseController.updateExpense
);

/**
 * DELETE /api/v1/expenses/:id
 * Удалить расход пользователя по ID
 */
router.delete('/:id', expenseController.deleteExpense);

export default router;