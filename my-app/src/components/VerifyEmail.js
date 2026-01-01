import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthAPI from '../services/AuthAPI';
import Message from './Message';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  const authAPI = new AuthAPI('http://localhost:3001/api');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setMessage('No verification token found');
          setMessageType('error');
          setLoading(false);
          return;
        }

        console.log('Token from URL:', token);
        const result = await authAPI.verifyEmail(token);

        if (result.success) {
          setMessage(result.message);
          setMessageType('success');
          setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } else {
          setMessage(result.message || 'Verification failed');
          setMessageType('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage(error.message || 'An error occurred during verification');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <>
          <Message message={message} type={messageType} />
          {messageType === 'success' && <p>Redirecting to login...</p>}
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
