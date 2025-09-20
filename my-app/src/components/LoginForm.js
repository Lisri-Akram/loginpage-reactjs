import React, { useState } from 'react';
import SocialLogin from './SocialLogin';

const LoginForm = ({ api, setMessage, isLoading, setIsLoading, handleForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await api.login(email, password);
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={`form login-form ${isLoading ? 'loading' : ''}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <span className="input-icon">📧</span>
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className="input-icon">🔒</span>
      </div>
      <div className="forgot-password">
        <a onClick={handleForgotPassword}>Forgot Password?</a>
      </div>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        Sign In
      </button>
      <div className="divider">or</div>
      <SocialLogin />
    </form>
  );
};

export default LoginForm;