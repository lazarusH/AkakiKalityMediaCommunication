import LatestNewsSlider from '../components/LatestNewsSlider';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>አቃቂ ቃሊቲ ክፍለ ከተማ</h1>
        <p>Akaki Kality Sub-City</p>
      </div>

      <div className="about-container">
        {/* Overview Section */}
        <section className="about-section">
          <h2>ስለ አቃቂ ቃሊቲ ክፍለ ከተማ</h2>
          <div className="section-content">
            <p className="amharic-text">
              አቃቂ ቃሊቲ ክፍለ ከተማ  በኢትዮጲያ ዋና ከተማ በሆነችው አዲስ አበባ ከተማ ከሚገኙት አስራ አንድ ክፍለ ከተሞች አንዱ ነው። በከተማው ደቡባዊ ክፍል ከከተማው መሃል 20 ኪ.ሜ ርቀት ላይ የሚገኝ ሲሆን ብዙ ኢንደስትሪዎች ስለሚገኙ የኢንዱስትሪ ዞን ነው።
            </p>
            <p className="amharic-text">
              በክፍለ ከተማ አስተዳደሩ 12 ወረዳዎች ያሉ ሲሆን በ2015 በጀት ዓመት መልሶ ማደራጀት በተሰራዉ መሠረት በስሩ 504 ብሎክ ፤በእማዉራ 18566 በአባዉራ 29272 በድምሩ 56379፤ በህዝብ ቁጥር 192859 ይገመታል።
            </p>
            <p className="amharic-text">
              በደርግ ጊዜ የሰሜኑ ክፍል ቃሊቲ/ወረዳ 27/ ከፍትኛ 27 እና ደቡባዊው ክፍል አቃቂ/ወረዳ 26/ ከፍትኛ 26 ተብሎ ይጠራ ነበር።የክፍለ ከተማው ከፍታ ከ2050 እስከ 2331 ሜትር ከባህር ጠለል በላይ ሲሆን 281 ሜትር ርቀት አለው።
            </p>
            <p className="amharic-text">
              ክፍለ ከተማው ስያሜውን ያገኘው አቃቂ እና ቃሊቲ የሚሉትን ስያሜዎች በማዋሃድ ነው።በአዲስ አበባ ደቡባዊ ክፍል ከምስራቅ እና ከደቡብ በኦሮሚያ ክልል ገላን ከተማ፣ ከምዕራብ በንፋስ ስልክ ላፍቶ፣ ከሰሜን በንፋስ ስልክ ላፍቶ እና በቦሌ ክፍለ ከተሞች የተከበበ ነው።
            </p>
          </div>
        </section>

        {/* Map Section */}
        <section className="about-section map-section">
          <h2>የአቃቂ ቃሊቲ ካርታ / Akaki Kality Map</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63063.98087276829!2d38.73864687910156!3d8.88767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8465b7e5f53d%3A0x3e7f0e3c3c3c3c3c!2sAkaki%20Kality%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1234567890123!5m2!1sen!2set"
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

        {/* Vision Section */}
        <section className="about-section vision-section">
          <div className="section-icon">🎯</div>
          <h2>ራዕይ / Vision</h2>
          <div className="section-content">
            <p className="highlight-text">
              አዲስ አበባ ከተማ በ 2017 ዓ.ም በአፍሪካ ከሚገኙ ምርጥ 5 ከተሞች መካከል አንዷ ሆና ማየት!
            </p>
            <p className="english-text">
              To see Addis Ababa become one of the top 5 cities in Africa by 2025!
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          <div className="section-icon">🚀</div>
          <h2>ተልዕኮ / Mission</h2>
          <div className="section-content">
            <p className="highlight-text">
              አዲስ አበባ ከተማ መልካም አስተዳደር የሰፈነባት የላቀ ልማት የሚረጋገጥባትና ጠንካራ የሀገር ውስጥ እና አለም አቀፍ ግንኙነት የሚጠናከርባት እና ለኗሪዎቿ ምቹ  ከተማ ማድረግ!
            </p>
            <p className="english-text">
              To make Addis Ababa a city with good governance, advanced development, strong domestic and international relations, and comfortable for its residents!
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section values-section">
          <div className="section-icon">⭐</div>
          <h2>እሴቶች / Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✓</div>
              <h3>ተጠያቂነት</h3>
              <p>Accountability</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👁️</div>
              <h3>ግልፅነት</h3>
              <p>Transparency</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>የላቀ አገልግሎት መስጠት</h3>
              <p>Excellence in Service</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📚</div>
              <h3>በዕውቀትና በዕምነት መምራትና መስራት</h3>
              <p>Leading and Working with Knowledge and Faith</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👥</div>
              <h3>የህዝብ ጥቅምን ማስቀደም</h3>
              <p>Prioritizing Public Interest</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>የህዝብ ለህዝብ ትስስርን ማጠናከር</h3>
              <p>Strengthening People-to-People Relations</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔄</div>
              <h3>ለለውጥ ዝግጁነት</h3>
              <p>Readiness for Change</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="about-section stats-section">
          <h2>በቁጥር / By the Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">ወረዳዎች / Woredas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">504</div>
              <div className="stat-label">ብሎክ / Blocks</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">192,859</div>
              <div className="stat-label">የህዝብ ቁጥር / Population</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20 ኪ.ሜ</div>
              <div className="stat-label">ከከተማው መሃል / From City Center</div>
            </div>
          </div>
        </section>
      </div>

      <LatestNewsSlider />
    </div>
  );
};

export default About;


