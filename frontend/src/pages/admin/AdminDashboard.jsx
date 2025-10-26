import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>የአስተዳደር ፓናል</h2>
          <p>እንኳን ደህና መጡ, {userProfile?.name || 'አስተዳዳሪ'}</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            መነሻ ገጽ
          </Link>
          <Link 
            to="/admin/articles" 
            className={`nav-item ${isActive('/admin/articles') ? 'active' : ''}`}
          >
            <span className="nav-icon">📰</span>
            ዜናዎች
          </Link>
          <Link 
            to="/admin/gallery" 
            className={`nav-item ${isActive('/admin/gallery') ? 'active' : ''}`}
          >
            <span className="nav-icon">📸</span>
            ምስል ማስቀመጫ
          </Link>
          <Link 
            to="/admin/files" 
            className={`nav-item ${isActive('/admin/files') ? 'active' : ''}`}
          >
            <span className="nav-icon">📄</span>
            ፋይሎችና ቅጾች
          </Link>
                <Link 
                  to="/admin/institutions" 
                  className={`nav-item ${isActive('/admin/institutions') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏛️</span>
                  ተቋማት
                </Link>
                <Link 
                  to="/admin/social-media" 
                  className={`nav-item ${isActive('/admin/social-media') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📱</span>
                  ማህበራዊ ሚዲያ
                </Link>
              </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            ድረ-ገጹን ይመልከቱ
          </Link>
          <button onClick={handleSignOut} className="logout-btn">
            <span className="nav-icon">🚪</span>
            ውጣ
          </button>
        </div>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;

