import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getYouTubeThumbnail } from '../lib/youtube';
import './LatestNewsSlider.css';

const LatestNewsSlider = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocalNews();
  }, []);

  const fetchLocalNews = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Local')  // Filter only Local news
        .order('published_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching local news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || news.length === 0) {
    return null;
  }

  return (
    <div className="latest-news-slider">
      <div className="latest-news-container">
        <div className="latest-news-header">
          <h2 className="latest-news-title">
            <span className="news-icon">📰</span>
            የአካባቢ ዜናዎች / Local News
          </h2>
          <Link to="/news/all" className="view-all-news">
            ሁሉንም ይመልከቱ →
          </Link>
        </div>
        
        <div className="news-slider-track">
          <div className="news-slider-content">
            {news.concat(news).map((article, index) => {
              const thumbnail = article.image_url || 
                (article.video_url ? getYouTubeThumbnail(article.video_url) : null);
              
              return (
                <Link 
                  to={`/article/${article.id}`} 
                  key={`${article.id}-${index}`} 
                  className="latest-news-item"
                >
                  {thumbnail && (
                    <img src={thumbnail} alt={article.title} className="latest-news-thumb" />
                  )}
                  <div className="latest-news-info">
                    <span className="latest-news-category">{article.category}</span>
                    <h3 className="latest-news-item-title">{article.title}</h3>
                    <span className="latest-news-date">
                      {new Date(article.published_at).toLocaleDateString('am-ET', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNewsSlider;

