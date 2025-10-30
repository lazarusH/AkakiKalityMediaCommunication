// Extract YouTube video ID from various URL formats
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get YouTube thumbnail URL from video URL
// Returns highest quality available with automatic fallback
export const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  // Available qualities: maxresdefault, sddefault, hqdefault, mqdefault, default
  // Using hqdefault (480x360) as default - always available
  // maxresdefault (1280x720) only exists for high-quality uploads
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

// Get multiple thumbnail URLs with fallback options
export const getYouTubeThumbnails = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
  };
};

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url; // Return original if can't parse
  
  return `https://www.youtube.com/embed/${videoId}`;
};


