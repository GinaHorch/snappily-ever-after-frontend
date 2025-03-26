import api from './api';

export const galleryService = {
  // Get all images (filtered by user's group for guests)
  getAllImages: async () => {
    try {
      const response = await api.get('/images/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch images' };
    }
  },

  // Get single image by ID
  getImage: async (imageId) => {
    try {
      const response = await api.get(`/images/${imageId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch image' };
    }
  },

  // Upload new image with caption and message
  uploadImage: async ({ imageFile = null, comment = '', name = '' }) => {
    try {
      const formData = new FormData();
      // formData.append('image', imageFile);
      formData.append('comment', comment);
      formData.append('name', name);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to upload image' };
    }
  },

  // Update image details (caption, message)
  updateImage: async (imageId, { caption, message }) => {
    try {
      const response = await api.put(`/images/${imageId}/`, {
        caption,
        message,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update image' };
    }
  },

  // Admin only: Delete image
  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/images/delete/${imageId}/`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error.response?.data || { error: 'Failed to delete image' };
    }
  },

  // Admin only: Batch delete images
  batchDeleteImages: async (imageIds) => {
    try {
      const response = await api.post('/images/batch-delete/', {
        image_ids: imageIds,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete images' };
    }
  },

  // Get images by group
  getImagesByGroup: async (groupId) => {
    try {
      const response = await api.get(`/images/group/${groupId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch group images' };
    }
  },

  // Admin only: Get all groups with their images
  getAllGroups: async () => {
    try {
      const response = await api.get('/images/groups/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch groups' };
    }
  },

  // Add message to image
  addMessage: async (imageId, { message, name }) => {
    try {
      const response = await api.post(`/images/${imageId}/message/`, {
        message,
        name,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add message' };
    }
  },

  // Get messages for an image
  getImageMessages: async (imageId) => {
    try {
      const response = await api.get(`/images/${imageId}/messages/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch messages' };
    }
  },

  // Admin only: Export all data
  exportData: async () => {
    try {
      console.log('Attempting to export data...');
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      
      // Log the full URL being constructed
      const baseUrl = api.defaults.baseURL;
      console.log('Base URL:', baseUrl);
      
      // Try multiple endpoint variations
      const endpoints = [
        '/images/export-data/',
        '/images/export-data',
        '/api/images/export-data/',
        '/api/images/export-data'
      ];
      
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          console.log('Full URL:', `${baseUrl}${endpoint}`);
          
          const response = await api.get(endpoint, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });

          console.log('Success with endpoint:', endpoint);
          console.log('Response type:', response.headers['content-type']);
          
          // Create a Blob from the JSON data
          const blob = new Blob([JSON.stringify(response.data, null, 2)], {
            type: 'application/json'
          });

          // Create a download link and trigger it
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const date = new Date().toISOString().split('T')[0];
          a.download = `wedding-guestbook-export-${date}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);

          return response.data;
        } catch (endpointError) {
          console.log(`Failed with endpoint ${endpoint}:`, endpointError.message);
          lastError = endpointError;
          continue; // Try next endpoint
        }
      }
      
      // If we get here, all endpoints failed
      throw lastError;
    } catch (error) {
      console.error('Export error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request headers:', error.config?.headers);
      throw error.response?.data || { error: 'Failed to export data' };
    }
  },

  // Download image (admin only)
  downloadImage: async (imageUrl, imageId) => {
    try {
      console.log('Attempting to download image:', imageUrl);
      
      // First try the API endpoint
      try {
        console.log('Attempting API endpoint download for image ID:', imageId);
        const response = await api.get(`/images/${imageId}/download/`, {
          responseType: 'blob',
          timeout: 5000 // Add 5 second timeout
        });
        
        // Create a download link for the blob
        const blob = new Blob([response.data], { 
          type: response.headers['content-type'] 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageUrl.split('/').pop(); // Use original filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch (apiError) {
        // Log detailed API error information
        console.log('API endpoint download failed, details:', {
          error: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          endpoint: `/images/${imageId}/download/`
        });
        
       // Use fetch instead of window.location
       try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch (fetchError) {
        console.error('Direct download failed:', fetchError);
        // As a last resort, open in new tab
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
          newWindow.location.href = imageUrl;
        } else {
          throw new Error('Pop-up blocked');
        }
        return true;
      }
    }
    } catch (error) {
      console.error('Download error:', error);
      throw { error: 'Failed to download image' };
    }
  },
}; 