import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Redirect } from "react-router-dom";

import './App.css';
import Header from './components/Header';
import NotesListPage from './pages/NotesListPage';
import NotePage from './pages/NotePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import subscribeUser from './pushNotifications';
import SharedNote from './pages/SharedNote';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    subscribeUser();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className={`container ${theme}`}>
        <div className="app">
          <Header 
            onLogout={handleLogout} 
            isAuthenticated={isAuthenticated} 
            theme={theme} 
            toggleTheme={toggleTheme} 
          />
          <Route path="/" exact>
            {isAuthenticated ? <NotesListPage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/note/:id">
            {isAuthenticated ? <NotePage /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            {isAuthenticated ? <Redirect to="/" /> : <LoginPage onLogin={handleLogin} />}
          </Route>
          <Route path="/register">
            {isAuthenticated ? <Redirect to="/" /> : <RegisterPage />}
          </Route>
          <Route 
              path="/notes/shared/:shared_id" 
              render={(props) => {
                  console.log("Route to SharedNote matched", props.match.params);
                  return <SharedNote {...props} />;
              }}
          />

        </div>
      </div>
    </Router>
  );
}

export default App;
