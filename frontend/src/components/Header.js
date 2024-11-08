import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { ReactComponent as MoonIcon } from "../assets/moon.svg";
import { ReactComponent as SunIcon } from "../assets/sun.svg";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";
import { ReactComponent as WifiIcon } from "../assets/wifi.svg";
import { ReactComponent as NoWifiIcon } from "../assets/no-wifi.svg";

export default function Header({ onLogout, isAuthenticated, theme, toggleTheme }) {
  const location = useLocation();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
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
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        {isOnline ? <WifiIcon className="network-status" /> : <NoWifiIcon className="network-status" />}
        {isAuthenticated && !isAuthPage && (
          <button onClick={onLogout} className="logout-button">
            <LogoutIcon />
          </button>
        )}
      </div>
    </div>
  );
}
