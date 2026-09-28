import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Modal from "../../components/Modal/Modal";
import TransactionForm from "../../components/TransactionForm/TransactionForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import { getBalance, getAllTransactions } from "../../services/summaryService";
import { addIncome, deleteIncome } from "../../services/incomeService";
import { addExpense, deleteExpense } from "../../services/expenseService";

function Dashboard() {
  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние данных
  const [balanceData, setBalanceData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Функция загрузки данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      const balance = await getBalance();
      setBalanceData(balance);

      const transactions = await getAllTransactions(5); // Последние 5 операций
      setRecentTransactions(transactions);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      alert("Не удалось загрузить данные. Убедитесь, что сервер запущен.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработка добавления операции
  const handleSubmit = async (data) => {
    try {
      if (data.type === "income") {
        await addIncome(data);
      } else {
        await addExpense(data);
      }

      // Перезагружаем данные после успешного добавления
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при добавлении операции:", error);
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

      // Перезагружаем данные после удаления
      await loadData();
    } catch (error) {
      console.error("Ошибка при удалении операции:", error);
      alert("Не удалось удалить операцию");
    }
  };

  // Обработка редактирования (пока заглушка)
  const handleEdit = (transaction) => {
    console.log("Редактировать операцию:", transaction);
    alert("Редактирование будет подключено позже");
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>

      {/* Карточки баланса */}
      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={balanceData.totalIncome}
          color="#10b981"
        />
        <BalanceCard
          title="Расходы"
          amount={balanceData.totalExpense}
          color="#ef4444"
        />
        <BalanceCard
          title="Баланс"
          amount={balanceData.balance}
          color="#2563eb"
        />
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
        </div>

        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <TransactionList
            transactions={recentTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        onClick={handleOpenModal}
        title="Добавить операцию"
      >
        +
      </button>

      {/* Модальное окно с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Новая операция"
      >
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default Dashboard;
