import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './InstitutionTemplate.css';

const InstitutionTemplate = ({ title, description, type, slug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentNews, setRecentNews] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchInstitutionData();
    fetchRecentNews();
  }, [slug, location.pathname]);

  const fetchInstitutionData = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: institutionData, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching institution data:', error);
      }

      setData(institutionData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentNews = async () => {
    try {
      const { data: newsData, error } = await supabase
        .from('articles')
        .select('id, title, category, created_at, image_url')
        .not('published_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent news:', error);
        return;
      }

      setRecentNews(newsData || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayData = data || {};
  const displayTitle = displayData.title || title;
  const displayDescription = displayData.description || description || `${displayTitle} በአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር ውስጥ ያለ አስፈላጊ የሥራ ክፍል ነው።`;
  
  // Parse functions if they exist
  const functions = displayData.functions 
    ? displayData.functions.split('\n').filter(f => f.trim())
    : [
        'የተቋሙን ዋና ተግባራት እና ኃላፊነቶች መወጣት',
        'የማህበረሰቡን ፍላጎት ማሟላት እና አገልግሎት መስጠት',
        'ከሌሎች ተቋማት ጋር በመተባበር የልማት ሥራዎችን ማከናወን',
        'የአመራር እና የቁጥጥር ስርዓቶችን ማጠናከር'
      ];

  if (loading) {
    return (
      <div className="institution-page">
        <div className="loading-container">
          <p>እየተጫነ ነው...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="institution-page">
      <div className="institution-header">
        <div className="institution-logo-container">
          <img 
            src={displayData.image_url || '/logo.png'} 
            alt={displayTitle} 
            className="institution-logo"
            onError={(e) => {
              e.target.src = '/logo.jpg';
            }}
          />
        </div>
        <h1 className="institution-title">{displayTitle}</h1>
      </div>
      
      <div className="institution-content">
        <div className="institution-info">
          <h2>መግቢያ / Introduction</h2>
          <p className="institution-description">
            {displayDescription}
          </p>
          
          <div className="institution-section">
            <h3>ዋና ተግባራት / Main Functions</h3>
            <ul>
              {functions.map((func, idx) => (
                <li key={idx}>{func}</li>
              ))}
            </ul>
          </div>

          {displayData.vision && (
            <div className="institution-section">
              <h3>ራዕይ / Vision</h3>
              <p>{displayData.vision}</p>
            </div>
          )}

          {!displayData.vision && (
            <div className="institution-section">
              <h3>ራዕይ / Vision</h3>
              <p>
                በአቃቂ ቃሊቲ ክፍለ ከተማ ውስጥ ከፍተኛ ጥራት ያለው አገልግሎት በመስጠት 
                ለማህበረሰቡ የተሻለ ህይወት ለማምጣት መሥራት።
              </p>
            </div>
          )}

          {displayData.mission && (
            <div className="institution-section">
              <h3>ተልዕኮ / Mission</h3>
              <p>{displayData.mission}</p>
            </div>
          )}

          {!displayData.mission && (
            <div className="institution-section">
              <h3>ተልዕኮ / Mission</h3>
              <p>
                በሙያዊነት እና ተገቢ በሆነ መንገድ ሕዝቡን ማገልገል፣ ልማታዊ ሥራዎችን 
                በተቀናጀ መንገድ ማከናወን እና የተቋሙን ተግባራት በብቃት መወጣት።
              </p>
            </div>
          )}

          {displayData.structure && (
            <div className="institution-section">
              <h3>የአደረጃጀት መዋቅር / Organizational Structure</h3>
              <p>{displayData.structure}</p>
            </div>
          )}

          {!displayData.structure && (
            <div className="institution-section">
              <h3>የአደረጃጀት መዋቅር / Organizational Structure</h3>
              <p>
                {displayTitle} የተቋቋመው የአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር አወቃቀር ስር ነው። 
                በተለያዩ ክፍሎች እና ቡድኖች የተደራጀ ሲሆን በሙያዊ ባለሙያዎች የሚመራ ነው።
              </p>
            </div>
          )}

          <div className="institution-section">
            <h3>ግንኙነት መረጃ / Contact Information</h3>
            <div className="contact-info">
              <p><strong>ስልክ / Phone:</strong> {displayData.contact_phone || '+251 11 XXX XXXX'}</p>
              <p><strong>ኢሜል / Email:</strong> {displayData.contact_email || 'info@akakikality.gov.et'}</p>
              <p><strong>አድራሻ / Address:</strong> {displayData.contact_address || 'አቃቂ ቃሊቲ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ'}</p>
            </div>
          </div>
        </div>

        <aside className="institution-sidebar">
          <div className="sidebar-card">
            <h3>ተዛማጅ አገናኞች</h3>
            <ul className="sidebar-links">
              <li><a href="/">መነሻ ገጽ</a></li>
              <li><a href="/news/all">ዜናዎች</a></li>
              <li><a href="/gallery">ምስል ማስቀመጫ</a></li>
              <li><a href="/files">ፋይሎችና ቅጾች</a></li>
              <li><a href="/about">ስለእኛ</a></li>
            </ul>
          </div>
          
          <div className="sidebar-card">
            <h3>የቅርብ ጊዜ ዜናዎች</h3>
            {recentNews.length > 0 ? (
              <div className="recent-news-list">
                {recentNews.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/article/${article.id}`} 
                    className="news-item"
                  >
                    {article.image_url && (
                      <div className="news-item-image">
                        <img src={article.image_url} alt={article.title} />
                      </div>
                    )}
                    <div className="news-item-content">
                      <h4 className="news-item-title">{article.title}</h4>
                      <span className="news-item-date">
                        {new Date(article.created_at).toLocaleDateString('am-ET', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
                <Link to="/news/all" className="view-all-news">
                  ሁሉንም ዜናዎች ይመልከቱ →
                </Link>
              </div>
            ) : (
              <p className="sidebar-text">የቅርብ ጊዜ ዜናዎች እና ማስታወቂያዎች በቅርቡ ይቀርባሉ።</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InstitutionTemplate;

