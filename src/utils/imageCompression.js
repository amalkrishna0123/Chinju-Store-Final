/**
 * Image compression utility for reducing image size before storing in Firebase
 * This helps prevent the Firebase document size limit error (1MB)
 */

/**
 * Compresses an image by reducing its quality and dimensions
 * @param {string} base64Image - The base64 string of the image to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width of the compressed image (default: 800)
 * @param {number} options.maxHeight - Maximum height of the compressed image (default: 800)
 * @param {number} options.quality - Image quality between 0 and 1 (default: 0.7)
 * @returns {Promise<string>} - A promise that resolves with the compressed image as a base64 string
 */
export const compressImage = (base64Image, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create an image to get the original dimensions
      const img = new Image();
      img.src = base64Image;
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a compressed base64 string
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        resolve(compressedBase64);
      };
      
      img.onerror = (error) => {
        reject(new Error('Error loading image for compression: ' + error));
      };
    } catch (error) {
      reject(new Error('Image compression failed: ' + error.message));
    }
  });
};

/**
 * Compresses multiple images in parallel
 * @param {Array<string>} base64Images - Array of base64 image strings
 * @param {Object} options - Compression options (same as compressImage)
 * @returns {Promise<Array<string>>} - A promise that resolves with an array of compressed images
 */
export const compressMultipleImages = async (base64Images, options = {}) => {
  if (!base64Images || !Array.isArray(base64Images)) {
    return [];
  }
  
  try {
    const compressPromises = base64Images.map(img => compressImage(img, options));
    return await Promise.all(compressPromises);
  } catch (error) {
    console.error('Error compressing multiple images:', error);
    return base64Images; // Return original images if compression fails
  }
};

/**
 * Optimizes product data by compressing images before storing in Firebase
 * @param {Object} productData - The product data object
 * @returns {Promise<Object>} - A promise that resolves with the optimized product data
 */
export const optimizeProductData = async (productData) => {
  try {
    // Create a copy of the product data
    const optimizedData = { ...productData };
    
    // Compress the main product image
    if (optimizedData.imageBase64) {
      optimizedData.imageBase64 = await compressImage(optimizedData.imageBase64, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.6
      });
    }
    
    // Compress sub-images if they exist
    if (optimizedData.subImagesBase64 && Array.isArray(optimizedData.subImagesBase64)) {
      optimizedData.subImagesBase64 = await compressMultipleImages(optimizedData.subImagesBase64, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.6
      });
    }
    
    return optimizedData;
  } catch (error) {
    console.error('Error optimizing product data:', error);
    return productData; // Return original data if optimization fails
  }
};