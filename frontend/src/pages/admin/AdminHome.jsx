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
    return <div className="admin-loading">እየተጫነ ነው...</div>;
  }

  return (
    <div className="admin-home">
      <div className="admin-header">
        <h1>የአስተዳደር መቆጣጠሪያ ሰሌዳ</h1>
        <p>እንኳን ወደ አቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር ፓናል በደህና መጡ</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📰</div>
          <div className="stat-info">
            <h3>{stats.articles}</h3>
            <p>ጠቅላላ ዜናዎች</p>
          </div>
          <Link to="/admin/articles" className="stat-link">ሁሉንም ይመልከቱ →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-info">
            <h3>{stats.gallery}</h3>
            <p>የምስል ማስቀመጫ</p>
          </div>
          <Link to="/admin/gallery" className="stat-link">ሁሉንም ይመልከቱ →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{stats.files}</h3>
            <p>ፋይሎች እና ቅጾች</p>
          </div>
          <Link to="/admin/files" className="stat-link">ሁሉንም ይመልከቱ →</Link>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>የቅርብ ጊዜ ዜናዎች</h2>
          <Link to="/admin/articles/new" className="btn-primary">
            + አዲስ ዜና ጨምር
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="no-data">
            <p>ገና ምንም ዜና የለም። የመጀመሪያውን ዜና ይፍጠሩ!</p>
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
                  {new Date(article.published_at).toLocaleDateString('am-ET', {
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
        <h2>ፈጣን እርምጃዎች</h2>
        <div className="actions-grid">
          <Link to="/admin/articles/new" className="action-card">
            <span className="action-icon">✍️</span>
            <h3>ዜና ይፍጠሩ</h3>
            <p>አዲስ ዜና ይጻፉ እና ያትሙ</p>
          </Link>
          <Link to="/admin/gallery/upload" className="action-card">
            <span className="action-icon">🖼️</span>
            <h3>ምስል ይጫኑ</h3>
            <p>ወደ ምስል ማስቀመጫ ፎቶዎችን ይጨምሩ</p>
          </Link>
          <Link to="/admin/files/upload" className="action-card">
            <span className="action-icon">📤</span>
            <h3>ፋይል ይጫኑ</h3>
            <p>ሰነዶችን እና ቅጾችን ይጨምሩ</p>
          </Link>
          <Link to="/" className="action-card">
            <span className="action-icon">👁️</span>
            <h3>ድረ-ገጹን ይመልከቱ</h3>
            <p>የህዝብ ድረ-ገጹን ይመልከቱ</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

