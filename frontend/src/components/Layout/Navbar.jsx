import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('am'); // 'am' for Amharic, 'en' for English
  const { user, signOut, isAdmin } = useAuth();
  const { isInstallable, isInstalled, handleInstallClick } = usePWAInstall();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force reload and navigate to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload anyway
      window.location.href = '/';
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'am' ? 'en' : 'am');
  };

  const nav = {
    am: {
      home: 'መነሻ',
      news: 'ዜና',
      gallery: 'ምስል',
      files: 'ፋይሎች',
      institutions: 'ተቋማት',
      about: 'ስለእኛ',
      install: 'አፕ ጫን',
      installed: 'ተጭኗል',
      admin: 'አስተዳደር',
      logout: 'ውጣ',
      login: 'ግባ',
    },
    en: {
      home: 'Home',
      news: 'News',
      gallery: 'Gallery',
      files: 'Files & Forms',
      institutions: 'Institutions',
      about: 'About Us',
      install: 'Install App',
      installed: 'Installed',
      admin: 'Admin',
      logout: 'Logout',
      login: 'Login',
    }
  };

  const t = nav[language];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Akaki Kality" className="nav-logo-img" />
          <span className="nav-title">
            {language === 'am' ? 'አቃቂ ቃሊቲ ክፍለ ከተማ ኮሙኒኬሽን ጽ/ቤት' : 'Akaki Kality Subcity Media Communication Office'}
          </span>
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.home}
          </Link>
          <Link to="/news/all" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.news}
          </Link>
          <Link to="/gallery" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.gallery}
          </Link>
          <Link to="/files" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.files}
          </Link>
          <Link to="/institutions" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.institutions}
          </Link>
          <Link to="/about" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.about}
          </Link>
          
          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button 
              onClick={() => {
                handleInstallClick();
                setIsOpen(false);
              }} 
              className="nav-button install-button"
              title={t.install}
            >
              📲 {t.install}
            </button>
          )}
          
          {isInstalled && (
            <span className="nav-links installed-badge" title={t.installed}>
              ✓ {t.installed}
            </span>
          )}
          
          {user && isAdmin() && (
            <Link to="/admin" className="nav-links admin-link" onClick={() => setIsOpen(false)}>
              {t.admin}
            </Link>
          )}
          
          {user && (
            <button onClick={handleSignOut} className="nav-button">
              {t.logout}
            </button>
          )}

          <button onClick={toggleLanguage} className="lang-toggle">
            {language === 'am' ? 'EN' : 'አማ'}
          </button>
        </div>

        <div className="nav-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
