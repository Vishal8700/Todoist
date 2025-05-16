import React, { useState } from 'react';
import './Auth.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Send OTP
  const handleSendOtp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setError(data.message || "User not found.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        setMessage("OTP verified. You can now reset your password.");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully. You can now log in.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h1 className="auth-title">Forgot Password</h1>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {!otpSent ? (
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <button onClick={handleSendOtp} className="auth-button">Send OTP</button>
          </div>
        ) : !otpVerified ? (
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="auth-input"
            />
            <button onClick={handleVerifyOtp} className="auth-button">Verify OTP</button>
          </div>
        ) : (
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="auth-input"
            />
            <button onClick={handleResetPassword} className="auth-button">Reset Password</button>
          </div>
        )}

        <p className="auth-switch">
          Remember your password? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
