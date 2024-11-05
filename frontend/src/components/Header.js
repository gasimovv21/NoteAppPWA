import React from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as MoonIcon } from "../assets/moon.svg";
import { ReactComponent as SunIcon } from "../assets/sun.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";

export default function Header({ onLogout, isAuthenticated, theme, toggleTheme }) {
  const location = useLocation();

  let title = "My Notes";
  if (location.pathname === "/login") {
    title = "Login";
  } else if (location.pathname === "/register") {
    title = "Register";
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-header">
      <h1>{title}</h1>
      <div className="header-icons">
        {/* Переключатель темы */}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        {/* Кнопка выхода для авторизованных пользователей */}
        {isAuthenticated && !isAuthPage && (
          <button onClick={onLogout} className="logout-button">
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  );
}
