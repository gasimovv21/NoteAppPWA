import React, { useEffect } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";

import './App.css';
import Header from './components/Header';
import NotesListPage from './pages/NotesListPage';
import NotePage from './pages/NotePage';
import subscribeUser from './pushNotifications';  // Импортируем функцию подписки

function App() {
  // Используем useEffect для вызова функции подписки при загрузке компонента
  useEffect(() => {
    subscribeUser();  // Подписка на уведомления
  }, []);

  return (
    <Router>
      <div className="container dark">
        <div className="app">
          <Header />
          <Route path="/" exact component={NotesListPage} />
          <Route path="/note/:id" component={NotePage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
