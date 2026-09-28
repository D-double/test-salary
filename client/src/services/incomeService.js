import { get, post, put, del } from './api.js';

/**
 * Получить все доходы с пагинацией и фильтрами
 * @param {Object} filters - параметры фильтрации
 * @param {number} filters.page - номер страницы (по умолчанию 1)
 * @param {number} filters.limit - количество записей на странице (по умолчанию 20)
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - фильтр: дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - фильтр: дата до (YYYY-MM-DD)
 * @returns {Promise<Object>} { data: Array, total: number, page: number, limit: number }
 */
export async function getIncomes(filters = {}) {
  try {
    const response = await get('/incomes', filters);
    return response;
  } catch (error) {
    console.error('Ошибка получения доходов:', error);
    throw error;
  }
}

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<Object|null>} объект дохода или null
 */
export async function getIncomeById(id) {
  if (!id) return null;

  try {
    const response = await get(`/incomes/${id}`);
    return response;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    console.error('Ошибка получения дохода по ID:', error);
    throw error;
  }
}

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода { amount, date, category, comment }
 * @returns {Promise<Object>} созданный доход
 */
export async function addIncome(incomeData) {
  if (!incomeData) {
    console.error('addIncome: данные не переданы');
    return null;
  }

  try {
    const response = await post('/incomes', incomeData);
    return response;
  } catch (error) {
    console.error('Ошибка добавления дохода:', error);
    throw error;
  }
}

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} incomeData - новые данные дохода
 * @returns {Promise<Object|null>} обновлённый доход или null, если не найден
 */
export async function updateIncome(id, incomeData) {
  if (!id || !incomeData) {
    console.error('updateIncome: id или данные не переданы');
    return null;
  }

  try {
    const response = await put(`/incomes/${id}`, incomeData);
    return response;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return null;
    }
    console.error('Ошибка обновления дохода:', error);
    throw error;
  }
}

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export async function deleteIncome(id) {
  if (!id) {
    console.error('deleteIncome: id не передан');
    return false;
  }

  try {
    await del(`/incomes/${id}`);
    return true;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return false;
    }
    console.error('Ошибка удаления дохода:', error);
    throw error;
  }
}