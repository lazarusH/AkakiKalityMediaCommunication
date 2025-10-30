import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './AdminHome.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    articles: 0,
    gallery: 0,
    files: 0,
    institutions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [articlesRes, galleryRes, filesRes, instRes] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('media_gallery').select('id', { count: 'exact', head: true }),
        supabase.from('filesandforms').select('id', { count: 'exact', head: true }),
        supabase.from('institutions').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        articles: articlesRes.count || 0,
        gallery: galleryRes.count || 0,
        files: filesRes.count || 0,
        institutions: instRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recent articles section removed per new dashboard spec

  if (loading) {
    return <div className="admin-loading">እየተጫነ ነው...</div>;
  }

  return (
    <div className="admin-home">
      <div className="admin-header">
        <h1>የአስተዳደር መቆጣጠሪያ ሰሌዳ</h1>
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

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{stats.institutions}</h3>
            <p>ተቋማት</p>
          </div>
          <Link to="/admin/institutions" className="stat-link">ሁሉንም ይመልከቱ →</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>ፈጣን እርምጃዎች</h2>
        <div className="actions-grid">
          <Link to="/admin/articles/new" className="action-card">
            <span className="action-icon">✍️</span>
            <h3>ዜና ይፍጠሩ</h3>
            <p>አዲስ ዜና ይጻፉ እና ያትሙ</p>
          </Link>
          <Link to="/admin/gallery" className="action-card">
            <span className="action-icon">🖼️</span>
            <h3>ምስል ይጫኑ</h3>
            <p>ወደ ምስል ማስቀመጫ ፎቶዎችን ይጨምሩ</p>
          </Link>
          <Link to="/admin/files" className="action-card">
            <span className="action-icon">📤</span>
            <h3>ፋይል ይጫኑ</h3>
            <p>ሰነዶችን እና ቅጾችን ይጨምሩ</p>
          </Link>
          <Link to="/admin/institutions" className="action-card">
            <span className="action-icon">🏢</span>
            <h3>ተቋማት አስተዳድር</h3>
            <p>ሁሉንም ፅ/ቤቶች አስተዳድር</p>
          </Link>
          <Link to="/admin/social-media" className="action-card">
            <span className="action-icon">💬</span>
            <h3>ማህበራዊ ሚዲያ</h3>
            <p>ማህበራዊ ሚዲያ ማስተዳደር</p>
          </Link>
          <Link to="/admin/about" className="action-card">
            <span className="action-icon">📋</span>
            <h3>ስለ እኛ</h3>
            <p>የገጹን ይዘት ያስተካክሉ</p>
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

