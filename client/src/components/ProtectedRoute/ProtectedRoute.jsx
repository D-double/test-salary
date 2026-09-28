import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

/**
 * Компонент для защиты маршрутов
 * Если пользователь не авторизован — перенаправляет на страницу входа
 * @param {Object} props
 * @param {React.ReactNode} props.children - защищаемый контент
 */
function ProtectedRoute({ children }) {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Перенаправляем на страницу входа, сохраняя текущий URL для возврата после входа
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
