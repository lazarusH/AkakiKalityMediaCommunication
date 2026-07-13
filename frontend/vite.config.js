import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const FLICKR_FEED_BASE = 'https://www.flickr.com/services/feeds/photoset.gne'

function flickrProxyPlugin() {
  return {
    name: 'flickr-proxy',
    configureServer(server) {
      server.middlewares.use('/api/flickr', async (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        const set = url.searchParams.get('set')
        const nsid = url.searchParams.get('nsid')

        if (!set || !nsid) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing required query params: set, nsid' }))
          return
        }

        const feedUrl = `${FLICKR_FEED_BASE}?set=${encodeURIComponent(set)}&nsid=${encodeURIComponent(nsid)}&format=json&nojsoncallback=1`

        try {
          const response = await fetch(feedUrl, {
            headers: {
              Accept: 'application/json',
              'User-Agent': 'AkakiKalityGallery/1.0',
            },
          })

          const body = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(body)
        } catch (error) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Failed to fetch Flickr feed' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), flickrProxyPlugin()],
})
