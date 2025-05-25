export const getFileInfo = async (uri) => {
    const filename = uri.split('/').pop();
    const ext = filename.split('.').pop().toLowerCase();
    
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp'
    };
  
    return {
      name: filename,
      type: mimeTypes[ext] || 'image/jpeg',
      ext
    };
  };