import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getYouTubeThumbnail, getYouTubeVideoId } from '../lib/youtube';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './NewsList.css';

const NewsList = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery]);

  useEffect(() => {
    setActiveCategory(category || 'all');
  }, [category]);

  const fetchArticles = async (cat) => {
    try {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (cat !== 'all') {
        query = query.eq('category', cat);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(article => 
      article.title?.toLowerCase().includes(query) ||
      article.content?.toLowerCase().includes(query)
    );
    setFilteredArticles(filtered);
  };

  const categories = [
    { value: 'all', label: 'ሁሉም' },
    { value: 'የሃገር', label: 'የሃገር' },
    { value: 'የከተማ', label: 'የከተማ' },
    { value: 'የክፍለ-ከተማ', label: 'የክፍለ-ከተማ' },
    { value: 'የወረዳ', label: 'የወረዳ' },
    { value: 'ያልተመደበ', label: 'ያልተመደበ' },
  ];

  return (
    <div className="news-list-page">
      <div className="news-header">
        <h1>News & Updates</h1>
        <p>Stay informed with the latest news from Akaki Kality</p>
      </div>

      <div className="news-container">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 ዜና ይፈልጉ... / Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="category-filter">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/news/${cat.value}`}
              className={`category-btn ${activeCategory === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="loading">እየተጫነ ነው... / Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="no-articles">
            <p>{searchQuery ? `"${searchQuery}" ተብሎ የተፈለገ ዜና አልተገኘም / No articles found for "${searchQuery}"` : 'በዚህ ምድብ ውስጥ ምንም ዜና የለም / No articles found in this category.'}</p>
          </div>
        ) : (
          <div className="articles-grid">
            {filteredArticles.map((article) => {
              // Get thumbnail: use image_url if available, otherwise YouTube thumbnail
              const thumbnail = article.image_url || (article.video_url ? getYouTubeThumbnail(article.video_url) : null);
              const videoId = article.video_url ? getYouTubeVideoId(article.video_url) : null;
              
              return (
                <Link to={`/article/${article.id}`} key={article.id} className="article-card">
                  {thumbnail && (
                    <div className="article-image-wrapper">
                      <img 
                        src={thumbnail} 
                        alt={article.title} 
                        className="article-image"
                        onError={(e) => {
                          // Fallback to default YouTube thumbnail if high quality fails
                          if (videoId && e.target.src.includes('hqdefault')) {
                            e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                          } else if (videoId && e.target.src.includes('mqdefault')) {
                            e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                          } else {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                      <span className="article-category">{article.category}</span>
                      {article.video_url && !article.image_url && (
                        <div className="video-badge">▶ Video</div>
                      )}
                    </div>
                  )}
                  <div className="article-body">
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-excerpt">
                      {article.content.substring(0, 200)}...
                    </p>
                    <div className="article-footer">
                      <span className="article-date">
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="read-more">Read More →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <LatestNewsSlider />
    </div>
  );
};

export default NewsList;

