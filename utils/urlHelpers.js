// utils/urlHelpers.js
export const normalizeImageUrl = (url) => {
    const base = 'http://192.168.10.40/storage/products/';
    const filename = url.split('/').pop(); 
    return `${base}${filename}?ts=${Date.now()}`;
  };