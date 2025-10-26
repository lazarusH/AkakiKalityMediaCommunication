import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('am'); // 'am' for Amharic, 'en' for English
  const [institutionsOpen, setInstitutionsOpen] = useState(false);
  const [activePool, setActivePool] = useState(null);
  const [institutionsData, setInstitutionsData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
  const { user, signOut, isAdmin } = useAuth();
  const { isInstallable, isInstalled, handleInstallClick } = usePWAInstall();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstitutions();

    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchInstitutions = async () => {
    try {
      // Fetch all pools
      const { data: pools, error: poolsError } = await supabase
        .from('institutions')
        .select('id, slug, title')
        .eq('type', 'pool')
        .order('title');

      if (poolsError) throw poolsError;

      // Fetch all offices with their pool relationships
      const { data: offices, error: officesError } = await supabase
        .from('institutions')
        .select('id, slug, title, pool_id')
        .eq('type', 'office')
        .order('title');

      if (officesError) throw officesError;

      // Organize offices under their pools
      const organizedData = pools.map(pool => ({
        id: pool.slug,
        title: pool.title,
        link: `/institutions/${pool.slug}`,
        offices: offices
          .filter(office => office.pool_id === pool.id)
          .map(office => ({
            title: office.title,
            link: `/institutions/${office.slug}`
          }))
      }));

      setInstitutionsData(organizedData);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      // Set empty array on error to prevent breaking the UI
      setInstitutionsData([]);
    }
  };

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
          
          {/* Institutions Dropdown */}
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setInstitutionsOpen(true)}
            onMouseLeave={() => {
              setInstitutionsOpen(false);
              setActivePool(null);
            }}
          >
            <span className="nav-links dropdown-trigger">
              {t.institutions} ▼
            </span>
            {institutionsOpen && (
              <div className="dropdown-menu">
                {institutionsData.map((pool) => (
                  <div 
                    key={pool.id}
                    className="dropdown-item-wrapper"
                    onMouseEnter={() => !isMobile && setActivePool(pool.id)}
                  >
                    {isMobile ? (
                      // Mobile: Show pool as button that toggles submenu
                      <div>
                        <button
                          className="dropdown-item pool-item"
                          onClick={(e) => {
                            e.preventDefault();
                            setActivePool(activePool === pool.id ? null : pool.id);
                          }}
                          style={{ 
                            width: '100%', 
                            background: 'transparent', 
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <span>{pool.title}</span>
                          <span className="office-count">{pool.offices.length}</span>
                        </button>
                        {activePool === pool.id && pool.offices.length > 0 && (
                          <div className="submenu">
                            <div className="submenu-header">
                              {pool.title} - ፅ/ቤቶች
                            </div>
                            {pool.offices.map((office, idx) => (
                              <Link
                                key={idx}
                                to={office.link}
                                className="submenu-item"
                                onClick={() => {
                                  setIsOpen(false);
                                  setInstitutionsOpen(false);
                                  setActivePool(null);
                                }}
                              >
                                {office.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Desktop: Show pool as link with hover submenu
                      <>
                        <Link 
                          to={pool.link} 
                          className="dropdown-item pool-item"
                          onClick={() => {
                            setIsOpen(false);
                            setInstitutionsOpen(false);
                            setActivePool(null);
                          }}
                        >
                          <span>{pool.title}</span>
                          <span className="office-count">{pool.offices.length}</span>
                        </Link>
                        {activePool === pool.id && pool.offices.length > 0 && (
                          <div className="submenu">
                            <div className="submenu-header">
                              {pool.title} - ፅ/ቤቶች
                            </div>
                            {pool.offices.map((office, idx) => (
                              <Link
                                key={idx}
                                to={office.link}
                                className="submenu-item"
                                onClick={() => {
                                  setIsOpen(false);
                                  setInstitutionsOpen(false);
                                  setActivePool(null);
                                }}
                              >
                                {office.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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
