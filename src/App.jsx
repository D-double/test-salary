import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import History from "./pages/History/History";

// Временная заглушка страницы — будет заменена на импорт из pages/ в фазе C
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
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<AnalyticsPlaceholder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
