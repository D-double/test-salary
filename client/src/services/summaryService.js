import { get } from './api.js';
import { getIncomes } from './incomeService.js';
import { getExpenses } from './expenseService.js';
import { getMonthNameShort } from '../utils/formatters.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants.js';

/**
 * Получить label категории по id
 * @param {string} categoryId - id категории
 * @param {string} type - тип операции ('income' или 'expense')
 * @returns {string} label категории
 */
function getCategoryLabel(categoryId, type) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find(cat => cat.id === categoryId);
  return category?.label || 'Прочее';
}

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export async function getBalance() {
  try {
    const response = await get('/summary/balance');
    return {
      totalIncome: response.totalIncome || 0,
      totalExpense: response.totalExpense || 0,
      balance: response.balance || 0,
    };
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
}

/**
 * Получить все операции (доходы + расходы), отсортированные по дате (новые сначала)
 * @param {number} limit - максимальное количество операций (по умолчанию без ограничений)
 * @returns {Promise<Array>} массив операций
 */
export async function getAllTransactions(limit = null) {
  try {
    // Делаем два запроса параллельно
    const [incomesResponse, expensesResponse] = await Promise.all([
      getIncomes({ limit: 1000 }),
      getExpenses({ limit: 1000 }),
    ]);

    const incomes = (incomesResponse.data || []).map(income => ({
      ...income,
      type: 'income',
      label: getCategoryLabel(income.category, 'income'), // Добавляем label
    }));

    const expenses = (expensesResponse.data || []).map(expense => ({
      ...expense,
      type: 'expense',
      label: getCategoryLabel(expense.category, 'expense'), // Добавляем label
    }));

    const allTransactions = [...incomes, ...expenses];

    allTransactions.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return dateB - dateA;
    });

    if (limit && limit > 0) {
      return allTransactions.slice(0, limit);
    }

    return allTransactions;
  } catch (error) {
    console.error('Ошибка получения всех операций:', error);
    return [];
  }
}

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} period - период ('all', 'today', 'week', 'month', 'year')
 * @returns {Promise<Array>} массив объектов { name, value } для recharts
 */
export async function getByCategory(type = 'expense', period = 'all') {
  try {
    const params = { type };

    if (period !== 'all') {
      const now = new Date();
      let dateFrom;

      switch (period) {
        case 'today':
          dateFrom = now.toISOString().split('T')[0];
          break;
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFrom = weekAgo.toISOString().split('T')[0];
          break;
        }
        case 'month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          break;
        case 'year':
          dateFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
      }

      if (dateFrom) {
        params.dateFrom = dateFrom;
      }
    }

    const response = await get('/summary/by-category', params);

    return (response || []).map(item => ({
      name: item.label || 'Прочее',
      value: item.total || 0,
    }));
  } catch (error) {
    console.error('Ошибка получения данных по категориям:', error);
    return [];
  }
}

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {number} monthsCount - количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} массив объектов { month, income, expense } для recharts
 */
export async function getMonthlySummary(monthsCount = 6) {
  try {
    const response = await get('/summary/by-month', { months: monthsCount });

    return (response || []).map(item => {
      const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;

      return {
        month: getMonthNameShort(monthIndex),
        income: item.income || 0,
        expense: item.expense || 0,
      };
    });
  } catch (error) {
    console.error('Ошибка получения помесячной статистики:', error);
    return [];
  }
}

/**
 * Получить операцию по ID (из доходов или расходов)
 * @param {string} id - идентификатор операции
 * @returns {Promise<Object|null>} объект операции или null
 */
export async function getTransactionById(id) {
  if (!id) return null;

  try {
    const incomesResponse = await getIncomes({ limit: 1000 });
    const foundIncome = (incomesResponse.data || []).find(i => i.id === id);
    if (foundIncome) {
      return {
        ...foundIncome,
        type: 'income',
        label: getCategoryLabel(foundIncome.category, 'income'),
      };
    }

    const expensesResponse = await getExpenses({ limit: 1000 });
    const foundExpense = (expensesResponse.data || []).find(e => e.id === id);
    if (foundExpense) {
      return {
        ...foundExpense,
        type: 'expense',
        label: getCategoryLabel(foundExpense.category, 'expense'),
      };
    }

    return null;
  } catch (error) {
    console.error('Ошибка получения операции по ID:', error);
    return null;
  }
}