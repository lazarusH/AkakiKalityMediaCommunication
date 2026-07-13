// Flickr API helper functions
// Uses a same-origin API proxy to avoid browser CORS restrictions

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
 */
export const extractFlickrAlbumId = (url) => {
  const guestPassMatch = url.match(/\/gp\/[^\/]+\/([^\/\?]+)/);
  if (guestPassMatch) {
    return guestPassMatch[1];
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
  const guestPassMatch = url.match(/\/gp\/([^\/]+)/);
  if (guestPassMatch) {
    return guestPassMatch[1];
  }

  const match = url.match(/\/photos\/([^\/]+)/);
  return match ? match[1] : null;
};

const mapFeedItems = (items) =>
  items.map((item, index) => ({
    id: item.link || index,
    title: item.title,
    thumbnail: item.media.m,
    large: item.media.m.replace('_m.jpg', '_b.jpg'),
    original: item.media.m.replace('_m.jpg', '.jpg'),
    description: item.description,
    link: item.link,
    published: item.published,
  }));

/**
 * Fetch photos from a Flickr album via the same-origin API proxy
 */
export const fetchFlickrAlbumPhotos = async (flickrUrl) => {
  try {
    if (isGuestPassUrl(flickrUrl)) {
      throw new Error(
        'Guest Pass URLs are not supported. Make the album PUBLIC on Flickr and use the regular album URL.'
      );
    }

    const albumId = extractFlickrAlbumId(flickrUrl);
    const userId = extractFlickrUserId(flickrUrl);

    if (!albumId) {
      throw new Error('Invalid Flickr URL: could not find album ID');
    }

    if (!userId) {
      throw new Error('Invalid Flickr URL: could not find user ID');
    }

    const proxyUrl = `/api/flickr?set=${encodeURIComponent(albumId)}&nsid=${encodeURIComponent(userId)}`;
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Flickr proxy error: ${response.status}`);
    }

    const data = await response.json();

    if (data?.items?.length) {
      return mapFeedItems(data.items);
    }

    return [];
  } catch (error) {
    console.error('Error fetching Flickr album photos:', error);
    return [];
  }
};

/**
 * Get a thumbnail URL from a Flickr photo URL
 */
export const getFlickrThumbnail = (photoUrl, size = 'm') => {
  if (!photoUrl) return null;

  if (photoUrl.includes('staticflickr.com')) {
    return photoUrl;
  }

  return photoUrl;
};
