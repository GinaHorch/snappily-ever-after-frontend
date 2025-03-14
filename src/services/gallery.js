import api from './api';

export const galleryService = {
  // Get all images (filtered by user's group for guests)
  getAllImages: async (groupId = null) => {
    try {
      const params = groupId ? { group: groupId } : {};
      const response = await api.get('/images/', { params });
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
      const response = await api.delete(`/images/${imageId}/delete/`);
      return response.data;
    } catch (error) {
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
      const response = await api.get('/images/export/', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to export data' };
    }
  },
}; 