// Extract YouTube video ID from various URL formats
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get YouTube thumbnail URL from video URL
export const getYouTubeThumbnail = (url, quality = 'maxresdefault') => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  // Available qualities: maxresdefault, sddefault, hqdefault, mqdefault, default
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url; // Return original if can't parse
  
  return `https://www.youtube.com/embed/${videoId}`;
};

