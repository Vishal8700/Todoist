import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
// Update the logo import path to use @/ or relative path
import logo from '../assets/logo.png';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      // Send POST request to backend
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Show success message
        setSuccessMessage("Account successfully created! Please log in.");
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 2000);
      } else {
        // Handle error response (e.g., show error message)
        const errorData = await response.json();
        alert(errorData.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-description">
          Get access to your free trial of aeronauts Community within 30 seconds!
        </p>

        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="auth-input"
            />
          </div>
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
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="password-requirements">
            <p>Your password must contain:</p>
            <ul>
              <li className={password.length >= 8 ? 'valid' : ''}>
                At least 8 characters
              </li>
              <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                Lower case letters (a-z)
              </li>
              <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                Upper case letters (A-Z)
              </li>
              <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                Numbers (0-9)
              </li>
              <li className={/[!@#$%^&*]/.test(password) ? 'valid' : ''}>
                Special characters (e.g. !@#$%^&*)
              </li>
            </ul>
          </div>

          <div className="form-group terms">
            <input type="checkbox" id="terms" className="terms-checkbox" required />
            <label htmlFor="terms" className="terms-label">
              By clicking Continue, you agree to the{" "}
              <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Notice</Link>
            </label>
          </div>

          <button type="submit" className="auth-button">
            Continue
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
