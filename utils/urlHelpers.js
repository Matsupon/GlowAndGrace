// utils/urlHelpers.js
export const normalizeImageUrl = (url) => {
    const base = 'http://192.168.10.40:8000/storage/products/';
    const filename = url.split('/').pop(); // Extracts "B6829XEgoYZanzSkMjLfrPxmSGcrLeAa0dmC7jp6.jpg"
    return `${base}${filename}?ts=${Date.now()}`;
  };