import * as summaryService from '../services/summaryService.js';

/**
 * Получить общий баланс пользователя
 * GET /api/v1/summary/balance
 */
export async function getBalance(req, res, next) {
  try {
    const userId = req.user.userId;
    const balance = await summaryService.getBalance(userId);
    res.json(balance);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить сумму по категориям пользователя
 * GET /api/v1/summary/by-category
 */
export async function getByCategory(req, res, next) {
  try {
    const userId = req.user.userId;
    const { type = 'expense', dateFrom, dateTo } = req.query;

    // Валидация типа
    if (type !== 'income' && type !== 'expense') {
      const error = new Error('Параметр type должен быть "income" или "expense"');
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    const result = await summaryService.getByCategory(userId, type, {
      dateFrom,
      dateTo,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Получить помесячную статистику пользователя
 * GET /api/v1/summary/by-month
 */
export async function getByMonth(req, res, next) {
  try {
    const userId = req.user.userId;
    const { months } = req.query;

    const result = await summaryService.getByMonth(userId, {
      months: Number(months),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}