import React from "react";
import styles from "./Dashboard.module.css";

// Временные заглушки компонентов — будут заменены на импорты из components/ в фазе D
const BalanceCardPlaceholder = ({ title, amount, color }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      borderLeft: `4px solid ${color || "#2563eb"}`,
    }}
  >
    <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
      {title || "Баланс"}
    </div>
    <div style={{ fontSize: "32px", fontWeight: 700, color: "#1f2937" }}>
      {amount ?? 0} ₽
    </div>
  </div>
);

const EmptyStatePlaceholder = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div
    style={{
      textAlign: "center",
      padding: "48px 24px",
      color: "#6b7280",
    }}
  >
    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
    <h3
      style={{
        fontSize: "18px",
        fontWeight: 600,
        marginBottom: "8px",
        color: "#1f2937",
      }}
    >
      {title || "Нет данных"}
    </h3>
    <p style={{ marginBottom: "24px" }}>
      {description || "Добавьте первую операцию, чтобы увидеть статистику"}
    </p>
    {actionLabel && (
      <button
        onClick={onAction}
        style={{
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 500,
          cursor: "pointer",
          border: "none",
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

function Dashboard() {
  // Временные значения — будут заменены на реальные данные из сервисов в фазе F
  const totalIncome = 0;
  const totalExpense = 0;
  const balance = totalIncome - totalExpense;
  const recentTransactions = [];

  const handleAddTransaction = () => {
    // Временная заглушка — будет подключена модалка с формой в фазе F
    console.log("Открыть форму добавления операции");
    alert("Форма добавления операции будет подключена позже");
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Главная</h1>

      {/* Карточки баланса */}
      <div className={styles.balanceGrid}>
        <BalanceCardPlaceholder
          title="Доходы"
          amount={totalIncome}
          color="#10b981"
        />
        <BalanceCardPlaceholder
          title="Расходы"
          amount={totalExpense}
          color="#ef4444"
        />
        <BalanceCardPlaceholder
          title="Баланс"
          amount={balance}
          color="#2563eb"
        />
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
        </div>

        {(recentTransactions?.length || 0) > 0 ? (
          <div>
            {/* Здесь будет TransactionList — подключим в фазе D */}
            <p>Список операций появится после подключения компонентов</p>
          </div>
        ) : (
          <EmptyStatePlaceholder
            title="Нет операций"
            description="Добавьте первую операцию, чтобы начать отслеживание финансов"
            actionLabel="Добавить операцию"
            onAction={handleAddTransaction}
          />
        )}
      </div>

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        onClick={handleAddTransaction}
        title="Добавить операцию"
      >
        +
      </button>
    </div>
  );
}

export default Dashboard;
