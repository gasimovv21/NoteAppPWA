import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    const response = await fetch('/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful! Please log in.');
      history.push('/login');
    } else {
      alert('Registration failed.');
    }
    setIsLoading(false);
  };

  return (
    <div className="register-container">
      {isLoading && (
        <div className="loading-overlay-log-reg">
          <LoadingIcon className="loading-spinner-log-reg" />
        </div>
      )}
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <Link to="/login" className="alternate-action">Already registered? Log In</Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
