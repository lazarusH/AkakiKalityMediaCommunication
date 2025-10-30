import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './About.css';

const About = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      
      // Convert array to object keyed by section_key for easy access
      const sectionsObj = {};
      (data || []).forEach(section => {
        sectionsObj[section.section_key] = section;
      });
      
      setSections(sectionsObj);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="about-page">
        <div className="loading-container">
          <p>እየተጫነ ነው...</p>
        </div>
      </div>
    );
  }

  // Sub-City sections
  const overview = sections.overview || {};
  const vision = sections.vision || {};
  const mission = sections.mission || {};
  const values = sections.values || {};
  const statistics = sections.statistics || {};
  const map = sections.map || {};

  // Media Communication Office sections
  const mediaOverview = sections.media_overview || {};
  const mediaVision = sections.media_vision || {};
  const mediaMission = sections.media_mission || {};
  const mediaValues = sections.media_values || {};
  const mediaStatistics = sections.media_statistics || {};

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>አቃቂ ቃሊቲ ክፍለ ከተማ</h1>
        <p>Akaki Kality Sub-City</p>
      </div>

      <div className="about-container">
        {/* Overview Section */}
        <section className="about-section">
          <h2>{overview.title_am}</h2>
          <div className="section-content">
            {overview.content_am && overview.content_am.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="amharic-text">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Map Section */}
        {map.metadata?.map_url && (
          <section className="about-section map-section">
            <h2>{map.title_am} / {map.title_en}</h2>
            <div className="map-container">
              <iframe
                src={map.metadata.map_url}
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Akaki Kality Map"
              ></iframe>
            </div>
          </section>
        )}

        {/* Vision Section */}
        <section className="about-section vision-section">
          {vision.metadata?.icon && <div className="section-icon">{vision.metadata.icon}</div>}
          <h2>{vision.title_am} / {vision.title_en}</h2>
          <div className="section-content">
            <p className="highlight-text">
              {vision.content_am}
            </p>
            {vision.content_en && (
              <p className="english-text">
                {vision.content_en}
              </p>
            )}
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          {mission.metadata?.icon && <div className="section-icon">{mission.metadata.icon}</div>}
          <h2>{mission.title_am} / {mission.title_en}</h2>
          <div className="section-content">
            <p className="highlight-text">
              {mission.content_am}
            </p>
            {mission.content_en && (
              <p className="english-text">
                {mission.content_en}
              </p>
            )}
          </div>
        </section>

        {/* Values Section - No icons, just text list */}
        <section className="about-section values-section">
          {values.metadata?.icon && <div className="section-icon">{values.metadata.icon}</div>}
          <h2>{values.title_am} / {values.title_en}</h2>
          <div className="values-grid">
            {(values.metadata?.items || []).map((item, idx) => (
              <div key={idx} className="value-card">
                <h3>{item.am}</h3>
                <p>{item.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="about-section stats-section">
          <h2>{statistics.title_am} / {statistics.title_en}</h2>
          <div className="stats-grid">
            {(statistics.metadata?.stats || []).map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label_am} / {stat.label_en}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MEDIA COMMUNICATION OFFICE SECTIONS */}
        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-content">
            <h2>የመገናኛ ብዙሀን ጽ/ቤት</h2>
            <p>Media Communication Office</p>
          </div>
          <div className="divider-line"></div>
        </div>

        {/* Media Overview Section */}
        <section className="about-section">
          <h2>{mediaOverview.title_am}</h2>
          <div className="section-content">
            {mediaOverview.content_am && mediaOverview.content_am.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="amharic-text">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Media Vision Section */}
        <section className="about-section vision-section">
          {mediaVision.metadata?.icon && <div className="section-icon">{mediaVision.metadata.icon}</div>}
          <h2>{mediaVision.title_am} / {mediaVision.title_en}</h2>
          <div className="section-content">
            <p className="highlight-text">
              {mediaVision.content_am}
            </p>
            {mediaVision.content_en && (
              <p className="english-text">
                {mediaVision.content_en}
              </p>
            )}
          </div>
        </section>

        {/* Media Mission Section */}
        <section className="about-section mission-section">
          {mediaMission.metadata?.icon && <div className="section-icon">{mediaMission.metadata.icon}</div>}
          <h2>{mediaMission.title_am} / {mediaMission.title_en}</h2>
          <div className="section-content">
            <p className="highlight-text">
              {mediaMission.content_am}
            </p>
            {mediaMission.content_en && (
              <p className="english-text">
                {mediaMission.content_en}
              </p>
            )}
          </div>
        </section>

        {/* Media Values Section */}
        <section className="about-section values-section">
          {mediaValues.metadata?.icon && <div className="section-icon">{mediaValues.metadata.icon}</div>}
          <h2>{mediaValues.title_am} / {mediaValues.title_en}</h2>
          <div className="values-grid">
            {(mediaValues.metadata?.items || []).map((item, idx) => (
              <div key={idx} className="value-card">
                <h3>{item.am}</h3>
                <p>{item.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media Statistics Section */}
        <section className="about-section stats-section">
          <h2>{mediaStatistics.title_am} / {mediaStatistics.title_en}</h2>
          <div className="stats-grid">
            {(mediaStatistics.metadata?.stats || []).map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label_am} / {stat.label_en}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <LatestNewsSlider />
    </div>
  );
};

export default About;




