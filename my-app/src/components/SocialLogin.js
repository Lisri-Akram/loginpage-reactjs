import React from 'react';

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth integration would be implemented here`);
    console.log(`Social login with ${provider}`);
  };

  return (
    <div className="social-login">
      <button type="button" className="social-btn" onClick={() => handleSocialLogin('google')}>
        Google
      </button>
      <button type="button" className="social-btn" onClick={() => handleSocialLogin('github')}>
        GitHub
      </button>
    </div>
  );
};

export default SocialLogin;