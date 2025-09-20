class AuthAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async login(email, password) {
    const data = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
    }
    return data;
  }

  async signup(userData) {
    return await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return await this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // The other API methods (verifyEmail, resetPassword, getProfile, healthCheck, logout)
  // would be implemented here in a similar way.
}

export default AuthAPI;