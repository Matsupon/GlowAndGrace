  // utils/urlHelpers.js
  import { API_URL } from '@env';

  export const normalizeImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    // If url is already a full URL, return as is
    if (url.startsWith('http')) return url;
    // Otherwise, construct the full URL
    return `${API_URL}/storage/products/${url.split('/').pop()}`;
  };

  export const normalizeFdaImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `${API_URL}/storage/fda/${url.split('/').pop()}`;
  };