import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/admin', icon: '📈', label: 'Dashboard', labelAm: 'መነሻ', exact: true },
    { path: '/admin/articles', icon: '📝', label: 'Articles', labelAm: 'ዜናዎች' },
    { path: '/admin/gallery', icon: '🖼️', label: 'Gallery', labelAm: 'ምስል' },
    { path: '/admin/files', icon: '📁', label: 'Files', labelAm: 'ፋይሎች' },
    { path: '/admin/institutions', icon: '🏢', label: 'Institutions', labelAm: 'ተቋማት' },
    { path: '/admin/social-media', icon: '💬', label: 'Social Media', labelAm: 'ማህበራዊ ሚዲያ' },
    { path: '/admin/about', icon: '📋', label: 'About', labelAm: 'ስለ እኛ' },
  ];

  return (
    <div className="admin-layout">
      {/* Top Header Bar */}
      <header className="admin-header-bar">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        
        <div className="header-right">
          <span className="user-name">👤 {userProfile?.name || 'Admin'}</span>
          <Link to="/" className="view-site-btn" title="View Website">
            🌐
          </Link>
          <button onClick={handleSignOut} className="logout-header-btn" title="Logout">
            ⬅️
          </button>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className={`admin-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="nav-list">
            {mobileMenuOpen && (
              <>
                <Link
                  to="/admin"
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-link-icon">📈</span>
                  <span className="nav-link-text">መነሻ</span>
                </Link>
                <div style={{height: '6px'}}></div>
              </>
            )}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${(item.exact ? location.pathname === item.path : isActive(item.path)) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-link-icon">{item.icon}</span>
                <span className="nav-link-text">{item.labelAm}</span>
              </Link>
            ))}
          </nav>
          <div className="nav-footer">
            <button className="nav-link logout-side" onClick={handleSignOut}>
              <span className="nav-link-icon">⬅️</span>
              <span className="nav-link-text">ውጣ</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
        )}

        {/* Main Content Area */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
