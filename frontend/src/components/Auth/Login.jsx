import React, { useState, useEffect } from 'react';
import './Auth.css';
// Update the logo import path
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/home'); // Update to navigate to home instead of root
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwtToken', data.token);
            navigate('/home');
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("An unexpected error occurred. Please try again later.");
    }
};


  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h1 className="auth-title">Log in</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-button">
            Continue
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p className="auth-switch">
            Forgot your password? <Link to="/forgetpass">Reset password</Link>
          </p>
        </form>

        <footer className="auth-footer">
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <span className="separator">|</span>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <p className="copyright">
            © 2024 Company Inc. all rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
