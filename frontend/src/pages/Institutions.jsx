import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Institutions.css';

const Institutions = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('type', 'office')
        .order('title');

      if (error) throw error;
      setOffices(data || []);
    } catch (error) {
      console.error('Error fetching offices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="institutions-page">
        <div className="loading-container">
          <p>እየተጫነ ነው...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="institutions-page">
      <div className="institutions-header">
        <h1>የክፍለ ከተማው ተቋማት</h1>
        <p className="institutions-subtitle">
          የአቃቂ ቃሊቲ ክፍለ ከተማ ፅ/ቤቶችና ተቋማት
        </p>
      </div>

      <div className="offices-grid">
        {offices.map((office) => (
          <Link
            key={office.id}
            to={`/institutions/${office.slug}`}
            className="office-card"
          >
            <div className="office-image-container">
              {office.image_url ? (
                <img 
                  src={office.image_url} 
                  alt={office.title}
                  className="office-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="office-placeholder-icon"
                style={{ display: office.image_url ? 'none' : 'flex' }}
              >
                🏢
              </div>
            </div>
            <div className="office-info">
              <h3 className="office-title">{office.title}</h3>
              {office.description && (
                <p className="office-description">
                  {office.description.length > 120 
                    ? `${office.description.substring(0, 120)}...` 
                    : office.description}
                </p>
              )}
            </div>
            <div className="office-card-footer">
              <span className="view-details">ዝርዝር ይመልከቱ →</span>
            </div>
          </Link>
        ))}
      </div>

      {offices.length === 0 && !loading && (
        <div className="no-offices">
          <p>ምንም ተቋማት አልተገኙም።</p>
        </div>
      )}
    </div>
  );
};

export default Institutions;




