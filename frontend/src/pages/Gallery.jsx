import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchFlickrAlbumPhotos } from '../lib/flickr';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [flickrAlbums, setFlickrAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [filteredAlbumPhotos, setFilteredAlbumPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchImages();
    fetchFlickrAlbums();
  }, []);

  useEffect(() => {
    filterContent();
  }, [searchQuery, images, flickrAlbums, albumPhotos]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
      setFilteredImages(data || []);
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

      const albums = data || [];
      setFlickrAlbums(albums);
      setFilteredAlbums(albums);
      setLoading(false);

      // Load missing covers in the background (don't block the page)
      loadAlbumCovers(albums);
    } catch (error) {
      console.error('Error fetching Flickr albums:', error);
      setLoading(false);
    }
  };

  const loadAlbumCovers = async (albums) => {
    const albumsNeedingCovers = albums.filter((album) => !album.thumbnail_url);

    for (const album of albumsNeedingCovers) {
      try {
        const photos = await fetchFlickrAlbumPhotos(album.flickr_url);
        if (!photos.length) continue;

        const updatedAlbum = {
          ...album,
          thumbnail_url: photos[0].thumbnail,
          photo_count: photos.length,
        };

        setFlickrAlbums((prev) =>
          prev.map((item) => (item.id === album.id ? updatedAlbum : item))
        );
        setFilteredAlbums((prev) =>
          prev.map((item) => (item.id === album.id ? updatedAlbum : item))
        );
      } catch (err) {
        console.error(`Error fetching cover for ${album.title}:`, err);
      }
    }
  };

  const filterContent = () => {
    if (!searchQuery.trim()) {
      setFilteredImages(images);
      setFilteredAlbums(flickrAlbums);
      setFilteredAlbumPhotos(albumPhotos);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter images
    const filtImgs = images.filter(img => 
      img.caption?.toLowerCase().includes(query)
    );
    setFilteredImages(filtImgs);

    // Filter albums
    const filtAlbums = flickrAlbums.filter(album => 
      album.title?.toLowerCase().includes(query) ||
      album.description?.toLowerCase().includes(query)
    );
    setFilteredAlbums(filtAlbums);

    // Filter album photos
    const filtPhotos = albumPhotos.filter(photo =>
      photo.title?.toLowerCase().includes(query)
    );
    setFilteredAlbumPhotos(filtPhotos);
  };

  const openAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoadingPhotos(true);
    setAlbumPhotos([]);
    
    try {
      const photos = await fetchFlickrAlbumPhotos(album.flickr_url);
      setAlbumPhotos(photos);
      setFilteredAlbumPhotos(photos);
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
        <h1>የምስል ማስቀመጫ / Photo Gallery</h1>
        <p>ትዝታዎችን እና ዝግጅቶችን ይመልከቱ / Browse through our collection of memorable moments and events</p>
      </div>

      {/* Search Bar */}
      {!loading && (images.length > 0 || flickrAlbums.length > 0) && (
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 ምስል ወይም አልበም ይፈልጉ... / Search photos or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="gallery-container">
        {loading ? (
          <div className="loading">እየተጫነ ነው... / Loading gallery...</div>
        ) : (
          <>
            {/* Show Album View or Photos View */}
            {!selectedAlbum ? (
              /* Albums Grid View */
              <>
                {/* Flickr Albums */}
                {filteredAlbums.length > 0 && (
                  <div className="gallery-section">
                    <h2 className="section-header">አልበሞች / Albums</h2>
                    <div className="gallery-grid albums-grid">
                      {filteredAlbums.map((album) => (
                        <div 
                          key={album.id} 
                          className="album-card" 
                          onClick={() => openAlbum(album)}
                        >
                          {album.thumbnail_url ? (
                            <img 
                              src={album.thumbnail_url} 
                              alt={album.title} 
                              loading="lazy"
                              onError={(e) => {
                                // If thumbnail fails to load, show placeholder
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className="album-placeholder"
                            style={{ display: album.thumbnail_url ? 'none' : 'flex' }}
                          >
                            <span className="album-icon">📁</span>
                          </div>
                          <div className="album-info">
                            <h3 className="album-title">{album.title}</h3>
                            {album.description && (
                              <p className="album-description">{album.description}</p>
                            )}
                            {album.photo_count > 0 && (
                              <span className="photo-count">{album.photo_count} ፎቶዎች / photos</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Uploaded Images Section */}
                {filteredImages.length > 0 && (
                  <div className="gallery-section">
                    <h2 className="section-header">የቅርብ ጊዜ ፎቶዎች / Recent Photos</h2>
                    <div className="gallery-grid">
                      {filteredImages.map((image) => (
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

                {(images.length === 0 && flickrAlbums.length === 0) || (filteredImages.length === 0 && filteredAlbums.length === 0 && searchQuery) ? (
                  <div className="no-images">
                    <p>{searchQuery ? `"${searchQuery}" ተብሎ የተፈለገ ምስል ወይም አልበም አልተገኘም / No images or albums found for "${searchQuery}"` : 'ገና ምንም ምስል የለም / No images available yet.'}</p>
                  </div>
                ) : null}
              </>
            ) : (
              /* Album Photos View */
              <div className="album-view">
                <button className="back-button" onClick={closeAlbum}>
                  ← ወደ አልበሞች ተመለስ / Back to Albums
                </button>
                
                <div className="album-header-view">
                  <h2>{selectedAlbum.title}</h2>
                  {selectedAlbum.description && <p>{selectedAlbum.description}</p>}
                </div>

                {loadingPhotos ? (
                  <div className="loading">እየተጫነ ነው... / Loading photos...</div>
                ) : filteredAlbumPhotos.length === 0 ? (
                  <div className="no-images">
                    <p>{searchQuery ? `"${searchQuery}" ተብሎ የተፈለገ ፎቶ አልተገኘም / No photos found for "${searchQuery}"` : 'ምንም ፎቶ የለም / No photos available.'}</p>
                  </div>
                ) : (
                  <div className="gallery-grid">
                    {filteredAlbumPhotos.map((photo, index) => (
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

