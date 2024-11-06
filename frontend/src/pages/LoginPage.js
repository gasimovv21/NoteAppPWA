import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (onLogin) {
          onLogin(data.token);
          history.push("/");
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div className="loading-overlay-log-reg">
          <LoadingIcon className="loading-spinner-log-reg" />
        </div>
      )}
      <form className="login-form" onSubmit={onSubmit}>
        <h1>Login</h1>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
        <Link to="/register" className="alternate-action">Not registered yet? Register</Link>
      </form>
    </div>
  );
}
