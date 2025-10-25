import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>አቃቂ ቃሊቲ ክፍለ ከተማ</h3>
          <h4>Akaki Kality Subcity</h4>
          <p>Serving the community with transparency and excellence</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/news/all">News</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/files">Documents</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Information</h3>
          <p>📍 Addis Ababa, Ethiopia</p>
          <p>📞 +251-11-XXX-XXXX</p>
          <p>✉️ info@akakikality.gov.et</p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="Telegram">TG</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Akaki Kality Subcity. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

