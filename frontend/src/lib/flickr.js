// Flickr API helper functions
// Note: This uses Flickr's public feed which doesn't require an API key for basic album viewing

/**
 * Check if URL is a Flickr guest pass URL
 */
export const isGuestPassUrl = (url) => {
  return url.includes('/gp/');
};

/**
 * Check if URL is a Flickr short URL
 */
export const isShortUrl = (url) => {
  return url.includes('flic.kr/s/');
};

/**
 * Extract album ID from Flickr URL
 * Examples:
 * - https://www.flickr.com/photos/username/albums/72157720123456789
 * - https://www.flickr.com/photos/username/albums/with/72157720123456789
 * - https://www.flickr.com/photos/username/sets/72157720123456789
 * - https://www.flickr.com/gp/username/shortcode (guest pass)
 */
export const extractFlickrAlbumId = (url) => {
  // Guest pass URLs - extract the short code
  const guestPassMatch = url.match(/\/gp\/[^\/]+\/([^\/\?]+)/);
  if (guestPassMatch) {
    return guestPassMatch[1]; // Return the short code as ID
  }
  
  const albumMatch = url.match(/\/albums\/(\d+)/);
  const albumWithMatch = url.match(/\/albums\/with\/(\d+)/);
  const setMatch = url.match(/\/sets\/(\d+)/);
  return albumMatch ? albumMatch[1] : albumWithMatch ? albumWithMatch[1] : setMatch ? setMatch[1] : null;
};

/**
 * Extract user ID from Flickr URL
 */
export const extractFlickrUserId = (url) => {
  // For guest pass URLs
  const guestPassMatch = url.match(/\/gp\/([^\/]+)/);
  if (guestPassMatch) {
    return guestPassMatch[1];
  }
  
  // For regular URLs
  const match = url.match(/\/photos\/([^\/]+)/);
  return match ? match[1] : null;
};

/**
 * Fetch photos from a Flickr album using oEmbed (no API key needed)
 * This is a workaround to display Flickr photos without requiring API authentication
 */
export const fetchFlickrAlbumPhotos = async (flickrUrl) => {
  try {
    // Check if it's a guest pass URL
    if (isGuestPassUrl(flickrUrl)) {
      console.warn('Guest pass URLs may not work with public RSS feeds');
      throw new Error('Guest Pass URLs are not fully supported. Please make the album PUBLIC on Flickr and use the regular album URL instead. To do this:\n1. Go to your album on Flickr\n2. Click Edit\n3. Change Privacy to Public\n4. Use the new URL (should look like: /photos/username/albums/[numbers])');
    }
    
    // Try to use Flickr's public RSS feed
    const albumId = extractFlickrAlbumId(flickrUrl);
    const userId = extractFlickrUserId(flickrUrl);
    
    if (!albumId) {
      console.error('No album ID found in URL:', flickrUrl);
      throw new Error('Invalid Flickr URL: Please provide a link to a specific album, not the albums list page. The URL should end with a number like /albums/72157720123456789');
    }
    
    if (!userId) {
      console.error('No user ID found in URL:', flickrUrl);
      throw new Error('Invalid Flickr URL: Could not extract user ID from the URL');
    }

    // Use Flickr's public feed (no API key required)
    const feedUrl = `https://www.flickr.com/services/feeds/photoset.gne?set=${albumId}&nsid=${userId}&format=json&nojsoncallback=1`;
    
    // Use CORS proxy to bypass browser restrictions
    // Try multiple proxies with fallback
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
    ];
    
    let lastError = null;
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If we got valid data, return it
        if (data && data.items) {
          return data.items.map((item, index) => ({
            id: item.link || index,
            title: item.title,
            thumbnail: item.media.m, // Medium size
            large: item.media.m.replace('_m.jpg', '_b.jpg'), // Large size
            original: item.media.m.replace('_m.jpg', '.jpg'), // Original
            description: item.description,
            link: item.link,
            published: item.published,
          }));
        }
      } catch (error) {
        console.warn(`Proxy ${proxyUrl} failed:`, error.message);
        lastError = error;
        // Continue to next proxy
      }
    }
    
    // If all proxies failed, throw the last error
    throw lastError || new Error('All CORS proxies failed');
  } catch (error) {
    console.error('Error fetching Flickr album photos:', error);
    // Return empty array instead of throwing to fail gracefully
    return [];
  }
};

/**
 * Get a thumbnail URL from a Flickr photo URL
 */
export const getFlickrThumbnail = (photoUrl, size = 'm') => {
  // Sizes: s=small, m=medium, z=medium640, b=large, h=large1600
  if (!photoUrl) return null;
  
  // If it's already a static URL
  if (photoUrl.includes('staticflickr.com')) {
    return photoUrl;
  }
  
  return photoUrl;
};

