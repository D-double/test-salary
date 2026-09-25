import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";

// Временные заглушки страниц — будут заменены на импорты из pages/ в фазе C
const HistoryPlaceholder = () => (
  <div>
    <h1>История</h1>
    <p>Здесь будет список всех операций с фильтрами.</p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div>
    <h1>Аналитика</h1>
    <p>Здесь будут графики доходов и расходов.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPlaceholder />} />
          <Route path="/analytics" element={<AnalyticsPlaceholder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
