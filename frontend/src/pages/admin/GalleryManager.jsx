import { useEffect, useState } from 'react';
import { supabase, STORAGE_BUCKETS, getPublicUrl } from '../../lib/supabase';
import './GalleryManager.css';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [flickrAlbums, setFlickrAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showFlickrForm, setShowFlickrForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Flickr album states
  const [flickrTitle, setFlickrTitle] = useState('');
  const [flickrDescription, setFlickrDescription] = useState('');
  const [flickrUrl, setFlickrUrl] = useState('');
  const [flickrThumbnail, setFlickrThumbnail] = useState('');
  const [flickrPhotoCount, setFlickrPhotoCount] = useState('');
  const [editingFlickrId, setEditingFlickrId] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchFlickrAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('flickr_albums')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFlickrAlbums(data || []);
    } catch (error) {
      console.error('Error fetching Flickr albums:', error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0 || !caption) {
      alert('Please select at least one image and enter a caption');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Upload all images
      for (let i = 0; i < imageFiles.length; i++) {
        try {
          const imageFile = imageFiles[i];
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKETS.GALLERY_IMAGES)
            .upload(filePath, imageFile);

          if (uploadError) throw uploadError;

          const imageUrl = getPublicUrl(STORAGE_BUCKETS.GALLERY_IMAGES, filePath);

          // Insert to database with caption for each image
          const imageCaption = imageFiles.length === 1 ? caption : `${caption} (${i + 1}/${imageFiles.length})`;
          
          const { error: insertError } = await supabase
            .from('media_gallery')
            .insert([{
              caption: imageCaption,
              image_url: imageUrl,
              uploaded_at: new Date().toISOString(),
            }]);

          if (insertError) throw insertError;
          successCount++;
        } catch (imgError) {
          console.error(`Error uploading image ${i + 1}:`, imgError);
          failCount++;
        }
      }

      // Reset form
      setCaption('');
      setImageFiles([]);
      setImagePreviews([]);
      setShowUploadForm(false);
      
      // Show result message
      if (successCount > 0 && failCount === 0) {
        alert(`✅ Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}!`);
      } else if (successCount > 0 && failCount > 0) {
        alert(`⚠️ Uploaded ${successCount} image${successCount > 1 ? 's' : ''}, but ${failCount} failed.`);
      } else {
        alert('❌ Failed to upload images. Please try again.');
      }
      
      // Refresh the gallery list
      await fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('❌ Failed to upload images: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl, caption) => {
    if (!window.confirm(`"${caption}" የሚለውን ምስል መሰረዝ ይፈልጋሉ? / Are you sure you want to delete "${caption}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('media_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(images.filter(img => img.id !== id));
      alert('✅ ምስሉ በተሳካ ሁኔታ ተሰርዟል! / Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('❌ ምስሉን መሰረዝ አልተሳካም። እባክዎ እንደገና ይሞክሩ። / Failed to delete image. Please try again.');
    }
  };

  // Flickr Album Management Functions
  const handleFlickrSubmit = async (e) => {
    e.preventDefault();
    if (!flickrTitle || !flickrUrl) {
      alert('Please fill in at least the title and Flickr URL');
      return;
    }

    // Validate Flickr URL format
    const albumIdMatch = flickrUrl.match(/\/albums\/(\d+)/);
    const albumWithMatch = flickrUrl.match(/\/albums\/with\/(\d+)/);
    const setIdMatch = flickrUrl.match(/\/sets\/(\d+)/);
    const guestPassMatch = flickrUrl.match(/\/gp\/[^\/]+\/[^\/\?]+/);
    
    if (!albumIdMatch && !albumWithMatch && !setIdMatch && !guestPassMatch) {
      alert('❌ Invalid Flickr URL!\n\nThe URL should link to a specific album.\n\nExample of correct URLs:\n• https://www.flickr.com/photos/username/albums/72157720123456789\n• https://www.flickr.com/photos/username/albums/with/72157720123456789\n• https://www.flickr.com/gp/username/shortcode (guest pass)\n\nTo get the correct URL:\n1. Go to your Flickr albums page\n2. Click on a specific album\n3. Copy the URL from your browser address bar');
      return;
    }
    
    // Warn about guest pass URLs
    if (guestPassMatch) {
      const confirmed = window.confirm('⚠️ You\'re using a Guest Pass URL (for private albums).\n\nThis may not work properly. For best results:\n1. Make the album PUBLIC on Flickr\n2. Use the regular album URL instead\n\nDo you want to try anyway?');
      if (!confirmed) {
        return;
      }
    }

    setUploading(true);
    try {
      const albumData = {
        title: flickrTitle,
        description: flickrDescription,
        flickr_url: flickrUrl,
        thumbnail_url: flickrThumbnail,
        photo_count: parseInt(flickrPhotoCount) || 0,
        display_order: flickrAlbums.length,
        updated_at: new Date().toISOString(),
      };

      if (editingFlickrId) {
        // Update existing album
        const { error } = await supabase
          .from('flickr_albums')
          .update(albumData)
          .eq('id', editingFlickrId);

        if (error) throw error;
        alert('✅ Album updated successfully!');
      } else {
        // Insert new album
        const { error } = await supabase
          .from('flickr_albums')
          .insert([albumData]);

        if (error) throw error;
        alert('✅ Album added successfully!');
      }

      // Reset form and close it
      resetFlickrForm();
      setShowFlickrForm(false);
      await fetchFlickrAlbums();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('❌ Failed to save album: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  const handleEditFlickr = (album) => {
    setEditingFlickrId(album.id);
    setFlickrTitle(album.title);
    setFlickrDescription(album.description || '');
    setFlickrUrl(album.flickr_url);
    setFlickrThumbnail(album.thumbnail_url || '');
    setFlickrPhotoCount(album.photo_count?.toString() || '');
    setShowFlickrForm(true);
    // Scroll to the top to show the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFlickr = async (id, title) => {
    if (!window.confirm(`"${title}" የሚለውን አልበም መሰረዝ ይፈልጋሉ? / Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('flickr_albums')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFlickrAlbums(flickrAlbums.filter(album => album.id !== id));
      alert('✅ አልበሙ በተሳካ ሁኔታ ተሰርዟል! / Album deleted successfully!');
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('❌ አልበሙን መሰረዝ አልተሳካም። እባክዎ እንደገና ይሞክሩ። / Failed to delete album. Please try again.');
    }
  };

  const resetFlickrForm = () => {
    setFlickrTitle('');
    setFlickrDescription('');
    setFlickrUrl('');
    setFlickrThumbnail('');
    setFlickrPhotoCount('');
    setEditingFlickrId(null);
  };

  return (
    <div className="gallery-manager">
      <div className="manager-header">
        <h1>የምስል ማስቀመጫ አስተዳደር / Manage Gallery</h1>
        <div className="header-buttons">
          <button 
            onClick={() => {
              setShowUploadForm(!showUploadForm);
              if (showFlickrForm) setShowFlickrForm(false);
            }}
            className="btn-primary"
          >
            {showUploadForm ? '❌ ሰርዝ / Cancel' : '📤 ምስል ጫን / Upload Images'}
          </button>
          <button 
            onClick={() => {
              if (showFlickrForm) {
                // Closing the form
                setShowFlickrForm(false);
                resetFlickrForm();
              } else {
                // Opening the form
                setShowFlickrForm(true);
                if (showUploadForm) setShowUploadForm(false);
                resetFlickrForm(); // Clear any previous data
              }
            }}
            className="btn-secondary"
          >
            {showFlickrForm ? '❌ ሰርዝ / Cancel' : '➕ አልበም ጨምር / Add Album'}
          </button>
        </div>
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <h3>📤 ምስሎችን ይጫኑ / Upload Images</h3>
          <p className="form-help">በአንድ ጊዜ በርካታ ምስሎችን መምረጥ ይችላሉ / You can select multiple images to upload at once</p>
          
          <div className="form-group">
            <label htmlFor="caption">መግለጫ / Caption *</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="መግለጫ ያስገቡ / Enter caption (will be applied to all images)"
              required
              disabled={uploading}
            />
            <small>ለብዙ ምስሎች ቁጥር በራስ-ሰር ይመደባል / For multiple images, each will be numbered automatically</small>
          </div>

          <div className="form-group">
            <label htmlFor="image">ምስሎች / Images * (በርካታ ምርጫ ይደገፋል)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              required
              disabled={uploading}
            />
            <small>ብዙ ምስሎችን ለመምረጥ Ctrl (በMac ላይ Cmd) ይጫኑ / Hold Ctrl (Cmd on Mac) to select multiple images</small>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews-grid">
              <p className="preview-count">የተመረጡ / Selected: {imagePreviews.length} {imagePreviews.length > 1 ? 'ምስሎች / images' : 'ምስል / image'}</p>
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview.url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={() => removeImage(index)}
                    disabled={uploading}
                  >
                    ✕
                  </button>
                  <span className="preview-name">{preview.name}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading 
              ? `እየጫነ ነው ${imageFiles.length} ${imageFiles.length > 1 ? 'ምስሎችን' : 'ምስልን'}... / Uploading...` 
              : `${imageFiles.length > 0 ? imageFiles.length : ''} ${imageFiles.length > 1 ? 'ምስሎችን' : 'ምስልን'} ጫን / Upload`
            }
          </button>
        </form>
      )}

      {showFlickrForm && (
        <form onSubmit={handleFlickrSubmit} className="upload-form flickr-form" style={{display: 'block', backgroundColor: 'white'}}>
          <h3>{editingFlickrId ? '✏️ አልበም አርትዕ / Edit Album' : '➕ አልበም ጨምር / Add Album'}</h3>
          <p className="form-help">ከFlickr አልበም ያክሉ / Add an album from Flickr</p>
          
          <div className="form-group">
            <label htmlFor="flickr-title">የአልበም አርዕስት / Album Title *</label>
            <input
              type="text"
              id="flickr-title"
              value={flickrTitle}
              onChange={(e) => setFlickrTitle(e.target.value)}
              placeholder="ለምሳሌ፣ የበጋ ዝግጅቶች 2024 / e.g., Summer Events 2024"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="flickr-url">Flickr አልበም URL *</label>
            <input
              type="url"
              id="flickr-url"
              value={flickrUrl}
              onChange={(e) => setFlickrUrl(e.target.value)}
              placeholder="https://www.flickr.com/photos/username/albums/72157720123456789"
              required
              disabled={uploading}
            />
            <small>⚠️ አስፈላጊ / Important: በተወሰነ አልበም ላይ መጀመሪያ ጠቅ ያድርጉ፣ ከዚያ URL ን ይቅዱ / Click on a specific album first, then copy the URL (should contain numbers at the end)</small>
          </div>

          <div className="form-group">
            <label htmlFor="flickr-description">መግለጫ / Description (አማራጭ / Optional)</label>
            <textarea
              id="flickr-description"
              value={flickrDescription}
              onChange={(e) => setFlickrDescription(e.target.value)}
              placeholder="የአልበሙን አጭር መግለጫ / Brief description of the album"
              rows="3"
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="flickr-thumbnail">ምስል URL / Thumbnail URL (አማራጭ / Optional)</label>
            <input
              type="url"
              id="flickr-thumbnail"
              value={flickrThumbnail}
              onChange={(e) => setFlickrThumbnail(e.target.value)}
              placeholder="https://live.staticflickr.com/..."
              disabled={uploading}
            />
            <small>በፎቶው ላይ በቀኝ ጠቅ ያድርጉ → የምስል አድራሻን ይቅዱ / Right-click a photo from the album → Copy image address</small>
          </div>

          <div className="form-group">
            <label htmlFor="flickr-count">የፎቶዎች ብዛት / Number of Photos (አማራጭ / Optional)</label>
            <input
              type="number"
              id="flickr-count"
              value={flickrPhotoCount}
              onChange={(e) => setFlickrPhotoCount(e.target.value)}
              placeholder="ለምሳሌ 25 / e.g., 25"
              min="0"
              disabled={uploading}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading 
                ? 'እያስቀመጠ ነው... / Saving...' 
                : (editingFlickrId ? '💾 አልበምን አዘምን / Update Album' : '➕ አልበም ጨምር / Add Album')
              }
            </button>
            {editingFlickrId && (
              <button type="button" onClick={() => {
                resetFlickrForm();
                setShowFlickrForm(false);
              }} className="btn-cancel">
                ❌ አርትዕ ሰርዝ / Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      <div className="section">
        <h2 className="section-title">📷 Uploaded Images ({images.length})</h2>
        {loading ? (
          <div className="loading">እየተጫነ ነው... / Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="no-data">
            <p>ገና ምንም ምስል የለም። የመጀመሪያውን ምስል ይጫኑ! / No images yet. Upload your first image!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="gallery-table">
              <thead>
                <tr>
                  <th>ምስል / Image</th>
                  <th>መግለጫ / Caption</th>
                  <th>የተጫነበት ቀን / Upload Date</th>
                  <th>እርምጃዎች / Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.map((image) => (
                  <tr key={image.id}>
                    <td className="image-cell">
                      <img src={image.image_url} alt={image.caption} className="table-thumbnail" />
                    </td>
                    <td className="caption-cell">{image.caption}</td>
                    <td className="date-cell">
                      {new Date(image.uploaded_at).toLocaleDateString('am-ET', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleDelete(image.id, image.image_url, image.caption)}
                        className="btn-delete"
                        title="ሰርዝ / Delete"
                      >
                        🗑️ ሰርዝ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section flickr-section">
        <h2 className="section-title">📁 የፎቶ አልበሞች / Photo Albums ({flickrAlbums.length})</h2>
        {flickrAlbums.length === 0 ? (
          <div className="no-data">
            <p>ገና ምንም አልበም አልተጨመረም። "+ Add Album" የሚለውን ጠቅ አድርገው ይጀምሩ! / No albums added yet. Click "+ Add Album" to get started!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="gallery-table albums-table">
              <thead>
                <tr>
                  <th>ምስል / Thumbnail</th>
                  <th>አርዕስት / Title</th>
                  <th>መግለጫ / Description</th>
                  <th>የፎቶ ብዛት / Photos</th>
                  <th>የአሰላለፍ ቁጥር / Order</th>
                  <th>እርምጃዎች / Actions</th>
                </tr>
              </thead>
              <tbody>
                {flickrAlbums.map((album) => (
                  <tr key={album.id}>
                    <td className="image-cell">
                      {album.thumbnail_url ? (
                        <img src={album.thumbnail_url} alt={album.title} className="table-thumbnail" />
                      ) : (
                        <div className="placeholder-thumbnail-small">
                          <span>📁</span>
                        </div>
                      )}
                    </td>
                    <td className="title-cell">
                      <strong>{album.title}</strong>
                    </td>
                    <td className="description-cell">
                      {album.description || <em className="text-muted">No description</em>}
                    </td>
                    <td className="count-cell">
                      {album.photo_count > 0 ? `${album.photo_count} photos` : '-'}
                    </td>
                    <td className="order-cell">
                      {album.display_order}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditFlickr(album)}
                          className="btn-edit"
                          title="አርትዕ / Edit"
                        >
                          ✏️ አርትዕ
                        </button>
                        <button
                          onClick={() => handleDeleteFlickr(album.id, album.title)}
                          className="btn-delete"
                          title="ሰርዝ / Delete"
                        >
                          🗑️ ሰርዝ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;

