import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('am'); // 'am' for Amharic, 'en' for English
  const { user, signOut, isAdmin } = useAuth();
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
      about: 'ስለእኛ',
      admin: 'አስተዳደር',
      logout: 'ውጣ',
      login: 'ግባ',
    },
    en: {
      home: 'Home',
      news: 'News',
      gallery: 'Gallery',
      files: 'Files & Forms',
      about: 'About Us',
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
          <Link to="/about" className="nav-links" onClick={() => setIsOpen(false)}>
            {t.about}
          </Link>
          
          {user && isAdmin() && (
            <Link to="/admin" className="nav-links admin-link" onClick={() => setIsOpen(false)}>
              {t.admin}
            </Link>
          )}
          
          {user ? (
            <button onClick={handleSignOut} className="nav-button">
              {t.logout}
            </button>
          ) : (
            <Link to="/login" className="nav-button" onClick={() => setIsOpen(false)}>
              {t.login}
            </Link>
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
