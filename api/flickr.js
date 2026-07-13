const FLICKR_FEED_BASE = 'https://www.flickr.com/services/feeds/photoset.gne';
const CACHE_SECONDS = 60 * 60; // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { set, nsid } = req.query;

  if (!set || !nsid) {
    return res.status(400).json({ error: 'Missing required query params: set, nsid' });
  }

  const feedUrl = `${FLICKR_FEED_BASE}?set=${encodeURIComponent(set)}&nsid=${encodeURIComponent(nsid)}&format=json&nojsoncallback=1`;

  try {
    const response = await fetch(feedUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'AkakiKalityGallery/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Flickr returned ${response.status}` });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Flickr proxy error:', error);
    return res.status(502).json({ error: 'Failed to fetch Flickr feed' });
  }
}
