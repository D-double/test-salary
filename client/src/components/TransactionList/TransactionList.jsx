import React from "react";
import styles from "./TransactionList.module.css";
import EmptyState from "../EmptyState/EmptyState";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CATEGORY_ICONS } from "../../utils/constants";

/**
 * Компонент списка операций
 * @param {Object} props
 * @param {Array} props.transactions - массив операций
 * @param {Function} props.onEdit - обработчик редактирования
 * @param {Function} props.onDelete - обработчик удаления
 */
function TransactionList({ transactions = [], onEdit, onDelete }) {
  // Если операций нет — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="Нет операций"
        description="Добавьте первую операцию, нажав на кнопку «+»"
      />
    );
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "income";
        const amountClass = isIncome
          ? styles.amountIncome
          : styles.amountExpense;
        const sign = isIncome ? "+" : "-";

        // Используем label (русское название), если есть, иначе category
        const displayName =
          transaction.label || transaction.category || "Прочее";

        // Иконка категории
        const icon =
          CATEGORY_ICONS?.[transaction.category] || (isIncome ? "💰" : "💸");

        return (
          <div key={transaction.id} className={styles.item}>
            <div className={styles.icon}>{icon}</div>

            <div className={styles.info}>
              <span className={styles.category}>{displayName}</span>
              <span className={styles.date}>
                {formatDate(transaction.date)}
              </span>
            </div>

            <div className={styles.right}>
              <span className={`${styles.amount} ${amountClass}`}>
                {sign}
                {formatCurrency(transaction.amount)}
              </span>

              <div className={styles.actions}>
                {onEdit && (
                  <button
                    className={styles.actionButton}
                    onClick={() => onEdit(transaction)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles.actionButton}
                    onClick={() => onDelete(transaction)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
