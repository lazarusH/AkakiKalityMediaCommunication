import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './AdminHome.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    articles: 0,
    gallery: 0,
    files: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentArticles();
  }, []);

  const fetchStats = async () => {
    try {
      const [articlesRes, galleryRes, filesRes] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('media_gallery').select('id', { count: 'exact', head: true }),
        supabase.from('filesandforms').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        articles: articlesRes.count || 0,
        gallery: galleryRes.count || 0,
        files: filesRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category, published_at')
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentArticles(data || []);
    } catch (error) {
      console.error('Error fetching recent articles:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-home">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the Akaki Kality Subcity Admin Panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📰</div>
          <div className="stat-info">
            <h3>{stats.articles}</h3>
            <p>Total Articles</p>
          </div>
          <Link to="/admin/articles" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-info">
            <h3>{stats.gallery}</h3>
            <p>Gallery Images</p>
          </div>
          <Link to="/admin/gallery" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{stats.files}</h3>
            <p>Files & Forms</p>
          </div>
          <Link to="/admin/files" className="stat-link">View All →</Link>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Articles</h2>
          <Link to="/admin/articles/new" className="btn-primary">
            + New Article
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="no-data">
            <p>No articles yet. Create your first article!</p>
          </div>
        ) : (
          <div className="articles-list">
            {recentArticles.map((article) => (
              <Link 
                to={`/admin/articles/edit/${article.id}`} 
                key={article.id} 
                className="article-item"
              >
                <div className="article-info">
                  <h3>{article.title}</h3>
                  <span className="article-category">{article.category}</span>
                </div>
                <span className="article-date">
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/articles/new" className="action-card">
            <span className="action-icon">✍️</span>
            <h3>Create Article</h3>
            <p>Write and publish a new article</p>
          </Link>
          <Link to="/admin/gallery/upload" className="action-card">
            <span className="action-icon">🖼️</span>
            <h3>Upload Image</h3>
            <p>Add photos to the gallery</p>
          </Link>
          <Link to="/admin/files/upload" className="action-card">
            <span className="action-icon">📤</span>
            <h3>Upload File</h3>
            <p>Add documents and forms</p>
          </Link>
          <Link to="/" className="action-card">
            <span className="action-icon">👁️</span>
            <h3>View Site</h3>
            <p>See the public website</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

