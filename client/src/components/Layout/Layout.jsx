import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import { getCurrentUser, logout } from "../../services/authService";

/**
 * Основной layout приложения с навигацией
 * Содержит шапку с именем пользователя и кнопкой выхода,
 * боковое меню и область для дочерних маршрутов
 */
function Layout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>💰 Salary Tracker</h1>
        </div>

        <div className={styles.headerRight}>
          {user && <span className={styles.username}>👤 {user.username}</span>}
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Выйти из системы"
          >
            🚪 Выйти
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Боковое меню */}
        <nav className={styles.sidebar}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            🏠 Главная
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            📋 История
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            📊 Аналитика
          </NavLink>
        </nav>

        {/* Основная область с контентом */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
