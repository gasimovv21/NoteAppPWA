import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom"; // Добавляем useHistory
import { ReactComponent as MoonIcon } from "../assets/moon.svg";
import { ReactComponent as SunIcon } from "../assets/sun.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";

export default function Header({ onLogout, isAuthenticated, theme, toggleTheme }) {
  const location = useLocation();
  const history = useHistory(); // Добавляем useHistory для навигации
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await fetch("/api/user/", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        console.error("Failed to fetch user info");
      }
    };

    if (isAuthenticated) {
      fetchUsername();
    }
  }, [isAuthenticated]);

  // Редирект на страницу /login, если пользователь неавторизован
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login'); // Редирект на /login при выходе из профиля
    }
  }, [isAuthenticated, history]);

  let title = isAuthenticated ? `Hello, ${username}!` : "My Notes";
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
