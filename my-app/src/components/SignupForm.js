import React, { useState } from 'react';
import SocialLogin from './SocialLogin';

const SignupForm = ({ api, setMessage, isLoading, setIsLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.signup({ name, email, password, confirmPassword });
      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        e.target.reset();
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
    <form className={`form signup-form ${isLoading ? 'loading' : ''}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <span className="input-icon">👤</span>
      </div>
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
          minlength="6"
        />
        <span className="input-icon">🔒</span>
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minlength="6"
        />
        <span className="input-icon">🔐</span>
      </div>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        Create Account
      </button>
      <div className="divider">or</div>
      <SocialLogin />
    </form>
  );
};

export default SignupForm;