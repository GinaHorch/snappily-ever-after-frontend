import api from './api';

export const authService = {
  // Login for both admin and guests
  login: async (username, password) => {
    try {
      // If no username is provided, assume guest login PreWedding
      const loginData = username 
        ? { username, password }  // Admin logs in with username + password
        : { username: "PreWedding", password };  // Guests only enter passcode

      console.log('Attempting login with:', { ...loginData, password: '***' });
      const response = await api.post('/login/', loginData);
      console.log('Login response:', { ...response.data, token: response.data.token ? 'exists' : 'missing' });
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        isGuest: response.data.is_guest,
      }));

      console.log('Stored auth data:', { 
        token: localStorage.getItem('token') ? 'exists' : 'missing',
        user: localStorage.getItem('user')
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && !user.isGuest;
  },

  // Admin only: Update guest credentials
  updateGuestCredentials: async (username, password) => {
    try {
      const response = await api.put('/users/update-guest/', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update guest credentials' };
    }
  },

  // Admin only: Change admin password
  changeAdminPassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-admin-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },
}; 