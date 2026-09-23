import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';

// Временные заглушки страниц — будут заменены на импорты из pages/ в фазе C
const DashboardPlaceholder = () => (
  <div style={{ padding: '24px' }}>
    <h1>Главная</h1>
    <p>Здесь будет дашборд с балансом и последними операциями.</p>
  </div>
);

const HistoryPlaceholder = () => (
  <div style={{ padding: '24px' }}>
    <h1>История</h1>
    <p>Здесь будет список всех операций с фильтрами.</p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div style={{ padding: '24px' }}>
    <h1>Аналитика</h1>
    <p>Здесь будут графики доходов и расходов.</p>
  </div>
);

// Временная заглушка Layout — будет заменена на импорт из components/Layout/ в шаге B6
const LayoutPlaceholder = ({ children }) => (
  <div className={styles.app}>
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <LayoutPlaceholder>
        <Routes>
          <Route path="/" element={<DashboardPlaceholder />} />
          <Route path="/history" element={<HistoryPlaceholder />} />
          <Route path="/analytics" element={<AnalyticsPlaceholder />} />
        </Routes>
      </LayoutPlaceholder>
    </BrowserRouter>
  );
}

export default App;