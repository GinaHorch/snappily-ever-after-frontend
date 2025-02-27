import api from './api';

export const authService = {
  // Login for both admin and guests
  login: async (username, password) => {
    try {
      const response = await api.post('/users/login/', {
        username,
        password,
      });
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        username: response.data.username,
        isGuest: response.data.is_guest,
      }));
      
      return response.data;
    } catch (error) {
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