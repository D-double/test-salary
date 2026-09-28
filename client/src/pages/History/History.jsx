import React, { useState, useEffect } from "react";
import styles from "./History.module.css";
import TransactionList from "../../components/TransactionList/TransactionList";
import Modal from "../../components/Modal/Modal";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import { getAllTransactions } from "../../services/summaryService";
import {
  addIncome,
  updateIncome,
  deleteIncome,
} from "../../services/incomeService";
import {
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../utils/constants";
import { isDateInPeriod } from "../../utils/formatters";

function History() {
  // Состояние фильтров
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Состояние данных и загрузки
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      const transactions = await getAllTransactions();
      setAllTransactions(transactions);
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
      alert("Не удалось загрузить историю операций.");
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем категории для текущего фильтра типа (без дубликатов)
  const getCategoriesForFilter = () => {
    if (typeFilter === "income") {
      return INCOME_CATEGORIES;
    } else if (typeFilter === "expense") {
      return EXPENSE_CATEGORIES;
    } else {
      // Объединяем все категории и удаляем дубликаты по id
      const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
      const uniqueCategories = Array.from(
        new Map(allCategories.map((cat) => [cat.id, cat])).values(),
      );
      return uniqueCategories;
    }
  };

  // Фильтрация операций (клиентская, так как данных немного)
  const filteredTransactions = (allTransactions || []).filter((transaction) => {
    if (typeFilter !== "all" && transaction?.type !== typeFilter) return false;
    if (categoryFilter !== "all" && transaction?.category !== categoryFilter)
      return false;
    if (!isDateInPeriod(transaction?.date, periodFilter)) return false;
    return true;
  });

  // Открытие модалки для добавления
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Обработка отправки формы (добавление или редактирование)
  const handleSubmit = async (data) => {
    try {
      if (editingTransaction?.id) {
        // Редактирование существующей операции
        if (data.type === "income") {
          await updateIncome(editingTransaction.id, data);
        } else {
          await updateExpense(editingTransaction.id, data);
        }
      } else {
        // Добавление новой операции
        if (data.type === "income") {
          await addIncome(data);
        } else {
          await addExpense(data);
        }
      }

      // Перезагружаем данные и закрываем модалку
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при сохранении операции:", error);
      alert(`Ошибка: ${error.message || "Не удалось сохранить операцию"}`);
    }
  };

  // Обработка удаления операции
  const handleDelete = async (transaction) => {
    if (!transaction?.id) return;

    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту операцию?",
    );
    if (!confirmed) return;

    try {
      if (transaction.type === "income") {
        await deleteIncome(transaction.id);
      } else {
        await deleteExpense(transaction.id);
      }

      // Перезагружаем данные
      await loadData();
    } catch (error) {
      console.error("Ошибка при удалении операции:", error);
      alert("Не удалось удалить операцию");
    }
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setPeriodFilter("all");
  };

  // Смена типа фильтра — сбрасываем фильтр по категории
  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setCategoryFilter("all");
  };

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterInput}
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterInput}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {(getCategoriesForFilter() || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select
            className={styles.filterInput}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Сбросить фильтры
        </button>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        {isLoading ? (
          <p>Загрузка операций...</p>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Редактировать операцию" : "Новая операция"}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;
