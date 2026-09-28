import { get, post, put, del } from './api.js';

/**
 * Получить все расходы с пагинацией и фильтрами
 * @param {Object} filters - параметры фильтрации
 * @param {number} filters.page - номер страницы (по умолчанию 1)
 * @param {number} filters.limit - количество записей на странице (по умолчанию 20)
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - фильтр: дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - фильтр: дата до (YYYY-MM-DD)
 * @param {boolean} filters.isRecurring - фильтр по признаку регулярности
 * @returns {Promise<Object>} { data: Array, total: number, page: number, limit: number }
 */
export async function getExpenses(filters = {}) {
  try {
    const response = await get('/expenses', filters);
    return response;
  } catch (error) {
    console.error('Ошибка получения расходов:', error);
    throw error;
  }
}

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object|null>} объект расхода или null
 */
export async function getExpenseById(id) {
  if (!id) return null;

  try {
    const response = await get(`/expenses/${id}`);
    return response;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    console.error('Ошибка получения расхода по ID:', error);
    throw error;
  }
}

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода { amount, date, category, comment, isRecurring }
 * @returns {Promise<Object>} созданный расход
 */
export async function addExpense(expenseData) {
  if (!expenseData) {
    console.error('addExpense: данные не переданы');
    return null;
  }

  try {
    const response = await post('/expenses', expenseData);
    return response;
  } catch (error) {
    console.error('Ошибка добавления расхода:', error);
    throw error;
  }
}

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} expenseData - новые данные расхода
 * @returns {Promise<Object|null>} обновлённый расход или null, если не найден
 */
export async function updateExpense(id, expenseData) {
  if (!id || !expenseData) {
    console.error('updateExpense: id или данные не переданы');
    return null;
  }

  try {
    const response = await put(`/expenses/${id}`, expenseData);
    return response;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    console.error('Ошибка обновления расхода:', error);
    throw error;
  }
}

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export async function deleteExpense(id) {
  if (!id) {
    console.error('deleteExpense: id не передан');
    return false;
  }

  try {
    await del(`/expenses/${id}`);
    return true;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return false;
    }
    console.error('Ошибка удаления расхода:', error);
    throw error;
  }
}