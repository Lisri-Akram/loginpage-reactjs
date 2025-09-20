import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Message from './Message';
import AuthAPI from '../services/AuthAPI';

const AuthContainer = ({ config }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const api = new AuthAPI(config.API_BASE_URL);

  const handleToggleForm = (type) => {
    setIsSignup(type === 'signup');
    setMessage(null);
  };

  const handleForgotPassword = async () => {
    const email = prompt('Enter your email address:');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    try {
      const response = await api.forgotPassword(email);
      setMessage({ type: 'success', text: response.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  // Mousemove effect for the container
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = document.querySelector('.auth-container');
      if (container) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        container.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) rotateX(${mouseY * 10}deg) rotateY(${mouseX * 10}deg)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="auth-container">
      <div className="form-toggle">
        <button
          className={`toggle-btn ${!isSignup ? 'active' : ''}`}
          onClick={() => handleToggleForm('login')}
        >
          Login
        </button>
        <button
          className={`toggle-btn ${isSignup ? 'active' : ''}`}
          onClick={() => handleToggleForm('signup')}
        >
          Sign Up
        </button>
        <div className={`toggle-slider ${isSignup ? 'signup' : ''}`}></div>
      </div>
      <div className="form-container">
        {message && <Message type={message.type} text={message.text} />}
        {!isSignup ? (
          <LoginForm
            api={api}
            setMessage={setMessage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleForgotPassword={handleForgotPassword}
          />
        ) : (
          <SignupForm
            api={api}
            setMessage={setMessage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AuthContainer;