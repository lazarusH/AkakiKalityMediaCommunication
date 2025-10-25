import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchFlickrAlbumPhotos } from '../lib/flickr';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [flickrAlbums, setFlickrAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
    fetchFlickrAlbums();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchFlickrAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('flickr_albums')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Fetch first photo from each album to use as cover if no thumbnail
      const albumsWithCovers = await Promise.all(
        (data || []).map(async (album) => {
          if (!album.thumbnail_url) {
            try {
              const photos = await fetchFlickrAlbumPhotos(album.flickr_url);
              if (photos && photos.length > 0) {
                return { ...album, thumbnail_url: photos[0].thumbnail };
              }
            } catch (err) {
              console.error(`Error fetching cover for ${album.title}:`, err);
            }
          }
          return album;
        })
      );
      
      setFlickrAlbums(albumsWithCovers);
    } catch (error) {
      console.error('Error fetching Flickr albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoadingPhotos(true);
    setAlbumPhotos([]);
    
    try {
      const photos = await fetchFlickrAlbumPhotos(album.flickr_url);
      setAlbumPhotos(photos);
    } catch (error) {
      console.error(`Error loading album "${album.title}":`, error.message);
      alert('Failed to load album photos. Please try again.');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumPhotos([]);
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Photo Gallery</h1>
        <p>Browse through our collection of memorable moments and events</p>
      </div>

      <div className="gallery-container">
        {loading ? (
          <div className="loading">Loading gallery...</div>
        ) : (
          <>
            {/* Show Album View or Photos View */}
            {!selectedAlbum ? (
              /* Albums Grid View */
              <>
                {/* Flickr Albums */}
                {flickrAlbums.length > 0 && (
                  <div className="gallery-section">
                    <h2 className="section-header">Albums</h2>
                    <div className="gallery-grid albums-grid">
                      {flickrAlbums.map((album) => (
                        <div 
                          key={album.id} 
                          className="album-card" 
                          onClick={() => openAlbum(album)}
                        >
                          {album.thumbnail_url ? (
                            <img src={album.thumbnail_url} alt={album.title} loading="lazy" />
                          ) : (
                            <div className="album-placeholder">
                              <span className="album-icon">📁</span>
                            </div>
                          )}
                          <div className="album-info">
                            <h3 className="album-title">{album.title}</h3>
                            {album.description && (
                              <p className="album-description">{album.description}</p>
                            )}
                            {album.photo_count > 0 && (
                              <span className="photo-count">{album.photo_count} photos</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Images Section */}
                {images.length > 0 && (
                  <div className="gallery-section">
                    <h2 className="section-header">Recent Photos</h2>
                    <div className="gallery-grid">
                      {images.map((image) => (
                        <div key={image.id} className="gallery-item" onClick={() => openModal(image)}>
                          <img src={image.image_url} alt={image.caption} loading="lazy" />
                          <div className="gallery-overlay">
                            <p className="gallery-caption">{image.caption}</p>
                            <span className="view-icon">🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {images.length === 0 && flickrAlbums.length === 0 && (
                  <div className="no-images">
                    <p>No images available yet.</p>
                  </div>
                )}
              </>
            ) : (
              /* Album Photos View */
              <div className="album-view">
                <button className="back-button" onClick={closeAlbum}>
                  ← Back to Albums
                </button>
                
                <div className="album-header-view">
                  <h2>{selectedAlbum.title}</h2>
                  {selectedAlbum.description && <p>{selectedAlbum.description}</p>}
                </div>

                {loadingPhotos ? (
                  <div className="loading">Loading photos...</div>
                ) : (
                  <div className="gallery-grid">
                    {albumPhotos.map((photo, index) => (
                      <div 
                        key={photo.id || index} 
                        className="gallery-item" 
                        onClick={() => openModal({
                          image_url: photo.large,
                          caption: photo.title,
                          uploaded_at: photo.published
                        })}
                      >
                        <img src={photo.thumbnail} alt={photo.title} loading="lazy" />
                        <div className="gallery-overlay">
                          <p className="gallery-caption">{photo.title || 'Untitled'}</p>
                          <span className="view-icon">🔍</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <img src={selectedImage.image_url} alt={selectedImage.caption} />
            <div className="modal-caption">
              <p>{selectedImage.caption}</p>
              <span className="modal-date">
                {new Date(selectedImage.uploaded_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      <LatestNewsSlider />
    </div>
  );
};

export default Gallery;

