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
          <h2>Admin Panel</h2>
          <p>Welcome, {userProfile?.name || 'Admin'}</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link 
            to="/admin/articles" 
            className={`nav-item ${isActive('/admin/articles') ? 'active' : ''}`}
          >
            <span className="nav-icon">📰</span>
            Articles
          </Link>
          <Link 
            to="/admin/gallery" 
            className={`nav-item ${isActive('/admin/gallery') ? 'active' : ''}`}
          >
            <span className="nav-icon">📸</span>
            Gallery
          </Link>
          <Link 
            to="/admin/files" 
            className={`nav-item ${isActive('/admin/files') ? 'active' : ''}`}
          >
            <span className="nav-icon">📄</span>
            Files & Forms
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            View Site
          </Link>
          <button onClick={handleSignOut} className="logout-btn">
            <span className="nav-icon">🚪</span>
            Logout
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

