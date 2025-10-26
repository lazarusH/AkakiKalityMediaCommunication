import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getYouTubeThumbnail } from '../lib/youtube';
import NewsSlider from '../components/NewsSlider';
import LatestNewsSlider from '../components/LatestNewsSlider';
import logo from '../assets/logo.png';
import './Home.css';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [searchQuery, popularNews]);

  const fetchAllNews = async () => {
    try {
      // Fetch latest news for slider (top 5)
      const { data: latest, error: latestError } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(5);

      if (latestError) throw latestError;
      setLatestNews(latest || []);

      // Fetch ALL news for popular section (sorted by most recent)
      // TODO: Add view count tracking and sort by views
      const { data: popular, error: popularError } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (popularError) throw popularError;
      setPopularNews(popular || []);
      setFilteredNews(popular || []);

      // Fetch trending news for sidebar (top 5 most recent)
      const { data: trending, error: trendingError } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(5);

      if (trendingError) throw trendingError;
      setTrendingNews(trending || []);

      // Get unique categories
      const { data: allArticles } = await supabase
        .from('articles')
        .select('category');
      
      const categories = [...new Set(allArticles?.map(a => a.category) || [])];
      setAllCategories(categories);

    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    if (!searchQuery.trim()) {
      setFilteredNews(popularNews);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = popularNews.filter(article => 
      article.title?.toLowerCase().includes(query) ||
      article.content?.toLowerCase().includes(query) ||
      article.category?.toLowerCase().includes(query)
    );
    setFilteredNews(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search filters locally now
    filterNews();
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      navigate('/news/all');
    } else {
      navigate(`/news/${category}`);
    }
  };

  return (
    <div className="home">
      {/* Hero Section with Search */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            {/* Logo and Office Title */}
            <div className="hero-logo-section">
              <img src={logo} alt="Akaki Kality Logo" className="hero-logo" />
              <div className="hero-office-title">
                <h1 className="office-name-am">አቃቂ ቃሊቲ ክ/ከተማ አስተዳደር</h1>
                <h2 className="office-name-en">Aakaki Kality Sub-City Administration</h2>
                <h3 className="office-dept-am">ኮሙኒኬሽን ጽ/ቤት</h3>
                <h4 className="office-dept-en">Communication Office</h4>
              </div>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hero-search">
              <div className="search-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="🔍 ዜና ይፈልጉ... / Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    className="clear-hero-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="search-button">
                  ፈልግ / Search
                </button>
              </div>
            </form>

            {/* Category Filter Pills */}
            <div className="category-pills">
              <button 
                className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('all')}
              >
                ሁሉም / All
              </button>
              {allCategories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Slider - Right After Hero */}
      <LatestNewsSlider />

      {/* Main Content Area */}
      <div className="content-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>ዜናዎችን በመጫን ላይ... / Loading news...</p>
          </div>
        ) : (
          <>
            {/* Main Layout: Content + Sidebar */}
            <div className="main-layout">
              {/* Main Content */}
              <div className="main-content">
                {/* Popular News Grid */}
                <section className="news-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <span className="title-icon">📰</span>
                      {searchQuery ? `የፍለጋ ውጤቶች / Search Results (${filteredNews.length})` : 'ታዋቂ ዜናዎች / Popular News'}
                    </h2>
                    <Link to="/news/all" className="view-all-link">
                      ሁሉንም ይመልከቱ →
                    </Link>
                  </div>
                  
                  {filteredNews.length === 0 && searchQuery ? (
                    <div className="no-results">
                      <div className="no-results-icon">🔍</div>
                      <h3>ምንም ዜና አልተገኘም / No news found</h3>
                      <p>"{searchQuery}" ተብሎ የተፈለገ ዜና አልተገኘም / No articles found for "{searchQuery}"</p>
                      <button 
                        className="clear-search-button"
                        onClick={() => setSearchQuery('')}
                      >
                        ፍለጋን አጽዳ / Clear search
                      </button>
                    </div>
                  ) : (
                  <div className="news-grid">
                    {filteredNews.map((article) => {
                      const thumbnail = article.image_url || 
                        (article.video_url ? getYouTubeThumbnail(article.video_url) : null);
                      
                      return (
                        <Link to={`/article/${article.id}`} key={article.id} className="news-card">
                          {thumbnail && (
                            <div className="news-image-wrapper">
                              <img src={thumbnail} alt={article.title} className="news-image" />
                              {article.video_url && !article.image_url && (
                                <div className="video-badge">▶ ቪዲዮ</div>
                              )}
                              <div className="news-category-badge">{article.category}</div>
                            </div>
                          )}
                          <div className="news-card-content">
                            <h3 className="news-card-title">{article.title}</h3>
                            <p className="news-card-excerpt">
                              {article.content.substring(0, 120)}...
                            </p>
                            <div className="news-card-footer">
                              <span className="news-date">
                                📅 {new Date(article.published_at).toLocaleDateString('am-ET', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="read-more">ተጨማሪ ያንብቡ →</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <aside className="sidebar">
                {/* Trending News */}
                <div className="sidebar-section">
                  <h3 className="sidebar-title">
                    <span className="title-icon">📊</span>
                    በተደጋጋሚ የሚነበቡ
                  </h3>
                  <div className="trending-list">
                    {trendingNews.map((article, index) => {
                      const thumbnail = article.image_url || 
                        (article.video_url ? getYouTubeThumbnail(article.video_url) : null);
                      
                      return (
                        <Link to={`/article/${article.id}`} key={article.id} className="trending-item">
                          <div className="trending-number">{index + 1}</div>
                          {thumbnail && (
                            <img src={thumbnail} alt={article.title} className="trending-image" />
                          )}
                          <div className="trending-content">
                            <span className="trending-category">{article.category}</span>
                            <h4 className="trending-title">{article.title}</h4>
                            <span className="trending-date">
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

                {/* Categories Widget */}
                <div className="sidebar-section categories-widget">
                  <h3 className="sidebar-title">
                    <span className="title-icon">📂</span>
                    ምድቦች / Categories
                  </h3>
                  <div className="categories-list">
                    <Link to="/news/all" className="category-item">
                      <span className="category-name">ሁሉም ዜናዎች</span>
                      <span className="category-count">→</span>
                    </Link>
                    {allCategories.map((category) => (
                      <Link to={`/news/${category}`} key={category} className="category-item">
                        <span className="category-name">{category}</span>
                        <span className="category-count">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="sidebar-section quick-links-widget">
                  <h3 className="sidebar-title">
                    <span className="title-icon">🔗</span>
                    ፈጣን አገናኞች
                  </h3>
                  <div className="quick-links-list">
                    <Link to="/gallery" className="quick-link-item">
                      <span className="quick-link-icon">📸</span>
                      <span className="quick-link-text">የምስል ጋለሪ</span>
                    </Link>
                    <Link to="/files" className="quick-link-item">
                      <span className="quick-link-icon">📄</span>
                      <span className="quick-link-text">ፋይሎች እና ቅጾች</span>
                    </Link>
                    <Link to="/about" className="quick-link-item">
                      <span className="quick-link-icon">ℹ️</span>
                      <span className="quick-link-text">ስለ እኛ</span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>

            {/* Featured News Slider - At Bottom */}
            <section className="slider-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-icon">🔥</span>
                  የቅርብ ጊዜ ዜናዎች / Featured News
                </h2>
              </div>
              <NewsSlider articles={latestNews} />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
