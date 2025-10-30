/**
 * Image Optimization Utility
 * Compresses and optimizes images before uploading to reduce storage costs
 * while maintaining visual quality
 */

/**
 * Optimizes an image file by resizing and compressing it
 * @param {File} file - The original image file
 * @param {Object} options - Optimization options
 * @returns {Promise<File>} - The optimized image file
 */
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.88,
    format = 'image/webp', // WebP for better compression
  } = options;

  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to optimize image'));
              return;
            }

            // Create a new file from the blob
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'), // Change extension to .webp
              {
                type: format,
                lastModified: Date.now(),
              }
            );

            // Log compression results
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const optimizedSize = (optimizedFile.size / 1024 / 1024).toFixed(2);
            const savings = ((1 - optimizedFile.size / file.size) * 100).toFixed(1);
            
            console.log(`Image optimized: ${originalSize}MB → ${optimizedSize}MB (${savings}% reduction)`);
            
            resolve(optimizedFile);
          },
          format,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Optimizes multiple images
 * @param {FileList|Array<File>} files - Array of image files
 * @param {Object} options - Optimization options
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Array<File>>} - Array of optimized image files
 */
export const optimizeImages = async (files, options = {}, onProgress = null) => {
  const filesArray = Array.from(files);
  const optimizedFiles = [];
  
  for (let i = 0; i < filesArray.length; i++) {
    try {
      const optimized = await optimizeImage(filesArray[i], options);
      optimizedFiles.push(optimized);
      
      if (onProgress) {
        onProgress(i + 1, filesArray.length);
      }
    } catch (error) {
      console.error(`Failed to optimize ${filesArray[i].name}:`, error);
      // Keep the original file if optimization fails
      optimizedFiles.push(filesArray[i]);
    }
  }
  
  return optimizedFiles;
};

/**
 * Get optimization settings based on image purpose
 * @param {string} purpose - 'news', 'institution', 'gallery', 'thumbnail'
 * @returns {Object} - Optimization options
 */
export const getOptimizationSettings = (purpose) => {
  const settings = {
    news: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.88,
      format: 'image/webp',
    },
    institution: {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.90,
      format: 'image/webp',
    },
    gallery: {
      maxWidth: 2560,
      maxHeight: 2560,
      quality: 0.92,
      format: 'image/webp',
    },
    thumbnail: {
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.85,
      format: 'image/webp',
    },
  };
  
  return settings[purpose] || settings.news;
};




