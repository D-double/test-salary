import React, { useState } from "react";
import styles from "./History.module.css";

// Временная заглушка компонента — будет заменена на импорт из components/ в фазе D
const TransactionListPlaceholder = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "#6b7280",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "8px",
            color: "#1f2937",
          }}
        >
          Нет операций
        </h3>
        <p>Добавьте первую операцию, чтобы увидеть историю</p>
      </div>
    );
  }

  return (
    <div>
      {/* Здесь будет реальный список операций */}
      <p>
        Список операций появится после подключения компонента TransactionList
      </p>
    </div>
  );
};

function History() {
  // Состояние фильтров
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Временные данные — будут заменены на реальные из сервисов в фазе F
  const allTransactions = [];

  // Фильтрация операций (пока работает с пустым массивом)
  const filteredTransactions = (allTransactions || []).filter((transaction) => {
    if (typeFilter !== "all" && transaction.type !== typeFilter) return false;
    if (categoryFilter !== "all" && transaction.category !== categoryFilter)
      return false;
    // Фильтр по периоду будет реализован позже
    return true;
  });

  const handleEdit = (transaction) => {
    console.log("Редактировать операцию:", transaction);
    alert("Редактирование будет подключено позже");
  };

  const handleDelete = (transaction) => {
    console.log("Удалить операцию:", transaction);
    alert("Удаление будет подключено позже");
  };

  const handleResetFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setPeriodFilter("all");
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
            onChange={(e) => setTypeFilter(e.target.value)}
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
            {/* Категории будут добавлены позже из constants.js */}
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
        <TransactionListPlaceholder
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default History;
