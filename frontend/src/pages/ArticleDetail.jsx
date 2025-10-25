import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getYouTubeEmbedUrl } from '../lib/youtube';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchArticle();
    fetchAdditionalImages();
  }, [id]);

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (additionalImages.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [additionalImages, currentImageIndex]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalImages = async () => {
    try {
      const { data, error } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAdditionalImages(data || []);
    } catch (error) {
      console.error('Error fetching additional images:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === additionalImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? additionalImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && additionalImages.length > 1) {
      nextImage();
    }
    if (isRightSwipe && additionalImages.length > 1) {
      prevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (loading) {
    return <div className="loading-page">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="error-page">
        <h2>Article not found</h2>
        <Link to="/news/all" className="btn btn-primary">Back to News</Link>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="article-container">
        <div className="article-meta">
          <Link to={`/news/${article.category}`} className="category-badge">
            {article.category}
          </Link>
          <span className="publish-date">
            {new Date(article.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <h1 className="article-heading">{article.title}</h1>

        {article.image_url && (
          <div className="article-featured-image">
            <img src={article.image_url} alt={article.title} />
          </div>
        )}

        {article.video_url && (
          <div className="article-video">
            <h3>Related Video</h3>
            <div className="video-wrapper">
              <iframe
                src={getYouTubeEmbedUrl(article.video_url)}
                title={article.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="article-content">
          <p>{article.content}</p>
        </div>

        {additionalImages.length > 0 && (
          <div className="additional-images-section">
            <h3 className="additional-images-title">Related Images ({currentImageIndex + 1}/{additionalImages.length})</h3>
            
            <div className="image-slider">
              {/* Previous Button */}
              {additionalImages.length > 1 && (
                <button 
                  className="slider-btn prev-btn" 
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}

              {/* Image Display */}
              <div 
                className="slider-image-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img 
                  src={additionalImages[currentImageIndex].image_url} 
                  alt={`Article image ${currentImageIndex + 1}`}
                  className="slider-image"
                />
              </div>

              {/* Next Button */}
              {additionalImages.length > 1 && (
                <button 
                  className="slider-btn next-btn" 
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>

            {/* Slider Indicators/Dots */}
            {additionalImages.length > 1 && (
              <div className="slider-indicators">
                {additionalImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {additionalImages.length > 1 && (
              <div className="slider-thumbnails">
                {additionalImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image.image_url} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="article-actions">
          <Link to="/news/all" className="btn btn-secondary">
            ← Back to News
          </Link>
          <button onClick={() => window.print()} className="btn btn-outline">
            🖨️ Print Article
          </button>
        </div>
      </div>

      <LatestNewsSlider />
    </div>
  );
};

export default ArticleDetail;

