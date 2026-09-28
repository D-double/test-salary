import * as expenseService from '../services/expenseService.js';

/**
 * Получить все расходы пользователя с пагинацией и фильтрами
 * GET /api/v1/expenses
 */
export async function getAllExpenses(req, res, next) {
  try {
    const userId = req.user.userId;
    const { page, limit, category, dateFrom, dateTo, isRecurring } = req.query;

    const result = await expenseService.getAllExpenses(userId, {
      page: Number(page),
      limit: Number(limit),
      category,
      dateFrom,
      dateTo,
      isRecurring: isRecurring !== undefined ? isRecurring === 'true' : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить расход пользователя по ID
 * GET /api/v1/expenses/:id
 */
export async function getExpenseById(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const expense = await expenseService.getExpenseById(userId, id);

    if (!expense) {
      const error = new Error(`Расход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
}

/**
 * Создать новый расход для пользователя
 * POST /api/v1/expenses
 */
export async function createExpense(req, res, next) {
  try {
    const userId = req.user.userId;
    const { amount, date, category, comment, isRecurring } = req.body;

    const newExpense = await expenseService.createExpense(userId, {
      amount,
      date,
      category,
      comment,
      isRecurring,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
}

/**
 * Обновить существующий расход пользователя
 * PUT /api/v1/expenses/:id
 */
export async function updateExpense(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { amount, date, category, comment, isRecurring } = req.body;

    const updatedExpense = await expenseService.updateExpense(userId, id, {
      amount,
      date,
      category,
      comment,
      isRecurring,
    });

    if (!updatedExpense) {
      const error = new Error(`Расход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
}

/**
 * Удалить расход пользователя по ID
 * DELETE /api/v1/expenses/:id
 */
export async function deleteExpense(req, res, next) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleted = await expenseService.deleteExpense(userId, id);

    if (!deleted) {
      const error = new Error(`Расход с id=${id} не найден`);
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}