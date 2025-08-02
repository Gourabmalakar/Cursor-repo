import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Upload CV file
  uploadCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await axios.post(`${API_BASE_URL}/upload-cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload CV');
    }
  },

  // Generate webpage from CV data
  generateWebpage: async (cvData, template, customizations) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-webpage`, {
        cvData,
        template,
        customizations,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate webpage');
    }
  },

  // Get available templates
  getTemplates: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templates`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch templates');
    }
  },

  // Get preview URL for generated webpage
  getPreviewUrl: (webpageId) => {
    return `${API_BASE_URL}/preview/${webpageId}`;
  },

  // Get download URL for generated webpage
  getDownloadUrl: (webpageId) => {
    return `${API_BASE_URL}/download/${webpageId}`;
  },

  // Download webpage as ZIP
  downloadWebpage: async (webpageId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${webpageId}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `webpage-${webpageId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to download webpage');
    }
  },
};

export default api;