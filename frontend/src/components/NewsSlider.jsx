import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getYouTubeThumbnail } from '../lib/youtube';
import './NewsSlider.css';

const NewsSlider = ({ articles }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
    setIsAutoPlaying(false);
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  const article = articles[currentSlide];
  const thumbnail = article.image_url || (article.video_url ? getYouTubeThumbnail(article.video_url) : null);

  return (
    <div className="news-slider">
      <div className="slider-container" style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : {}}>
        <Link to={`/article/${article.id}`} className="slider-content">
          <div className="slider-overlay"></div>
          <div className="slider-text">
            <span className="slider-category">{article.category}</span>
            <h2 className="slider-title">{article.title}</h2>
            <p className="slider-excerpt">{article.content.substring(0, 200)}...</p>
            <span className="slider-date">
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </Link>

        {/* Navigation Arrows */}
        <button className="slider-arrow slider-prev" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>
        <button className="slider-arrow slider-next" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>

        {/* Dots Indicator */}
        <div className="slider-dots">
          {articles.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSlider;




