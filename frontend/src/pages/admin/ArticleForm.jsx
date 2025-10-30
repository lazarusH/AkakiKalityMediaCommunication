import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, STORAGE_BUCKETS, getPublicUrl } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { optimizeImage, getOptimizationSettings } from '../../utils/imageOptimizer';
import './ArticleForm.css';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'የከተማ',
    video_url: '',
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        content: data.content,
        category: data.category,
        video_url: data.video_url || '',
      });
      setMainImagePreview(data.image_url || '');
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);
      
      // Create previews for all images
      const previewPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ url: reader.result, name: file.name });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(previewPromises).then(previews => {
        setImagePreviews(previews);
        // Automatically select the first image as main
        if (previews.length > 0) {
          setSelectedImageIndex(0);
          setMainImage(files[0]);
          setMainImagePreview(previews[0].url);
        }
      });
    }
  };

  const selectMainImage = (index) => {
    setSelectedImageIndex(index);
    setMainImage(selectedImages[index]);
    setMainImagePreview(imagePreviews[index].url);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
    
    // If we removed the selected image, select the first one
    if (index === selectedImageIndex) {
      if (newImages.length > 0) {
        setSelectedImageIndex(0);
        setMainImage(newImages[0]);
        setMainImagePreview(newPreviews[0].url);
      } else {
        setSelectedImageIndex(null);
        setMainImage(null);
        setMainImagePreview('');
      }
    } else if (index < selectedImageIndex) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const uploadImage = async (file, type) => {
    try {
      console.log(`Optimizing ${type} image...`);
      
      // Optimize the image before uploading (reduces size while maintaining quality)
      const optimizedFile = await optimizeImage(file, getOptimizationSettings('news'));
      
      // Use .webp extension for optimized images
      const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `${fileName}`;

      console.log('Uploading optimized image to bucket:', STORAGE_BUCKETS.NEWS_IMAGES);
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.NEWS_IMAGES)
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);
      const publicUrl = getPublicUrl(STORAGE_BUCKETS.NEWS_IMAGES, filePath);
      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!user) {
      setError('You must be logged in to publish articles. Please refresh and login again.');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let imageUrl = mainImagePreview;
      
      // Upload new main image if selected
      if (mainImage) {
        console.log('Uploading main image...');
        imageUrl = await uploadImage(mainImage, 'main');
        console.log('Main image uploaded:', imageUrl);
      }

      const articleData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        image_url: imageUrl || null,
        video_url: formData.video_url || null,
        author_id: user.id,
        published_at: new Date().toISOString(),
      };

      console.log('Submitting article data:', articleData);

      let articleId = id;

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error(`Failed to update article: ${updateError.message}`);
        }
        toast.success('News updated successfully!');
      } else {
        const { data, error: insertError } = await supabase
          .from('articles')
          .insert([articleData])
          .select();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw new Error(`Failed to publish article: ${insertError.message}`);
        }
        
        console.log('Article created:', data);
        articleId = data[0].id;
        toast.success('News published successfully!');
      }

      // Upload additional images (excluding the main image)
      if (selectedImages.length > 0 && articleId) {
        console.log('Uploading additional images...');
        
        // If editing, delete existing additional images first
        if (isEdit) {
          await supabase
            .from('article_images')
            .delete()
            .eq('article_id', articleId);
        }

        // Upload all non-main images
        const additionalImages = selectedImages.filter((_, index) => index !== selectedImageIndex);
        
        for (let i = 0; i < additionalImages.length; i++) {
          try {
            const additionalImageUrl = await uploadImage(additionalImages[i], `additional-${i}`);
            
            await supabase
              .from('article_images')
              .insert([{
                article_id: articleId,
                image_url: additionalImageUrl,
                display_order: i
              }]);
            
            console.log(`Additional image ${i + 1} uploaded successfully`);
          } catch (imgError) {
            console.error(`Error uploading additional image ${i + 1}:`, imgError);
            // Continue with other images even if one fails
          }
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/articles', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Error saving article:', err);
      
      let errorMessage = err.message || 'An unexpected error occurred';
      
      if (errorMessage.includes('row-level security')) {
        errorMessage = 'Permission denied. Please make sure you are logged in as an admin. Try logging out and logging back in.';
      } else if (errorMessage.includes('foreign key')) {
        errorMessage = 'Database configuration error. Please contact support.';
      } else if (errorMessage.includes('violates')) {
        errorMessage = 'Invalid data. ' + errorMessage;
      }
      
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="article-form-page">
      <div className="form-header">
        <h1>{isEdit ? 'Edit News' : 'Create News'}</h1>
        <p style={{color: '#666', marginTop: '10px'}}>
          {user ? `Logged in as: ${user.email}` : 'Not logged in'}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          background: '#d1fae5',
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          animation: 'slideDown 0.3s ease'
        }}>
          <span style={{ fontSize: '2rem' }}>✅</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#065f46', marginBottom: '5px', fontSize: '1.1rem' }}>
              Success!
            </h3>
            <p style={{ color: '#047857', lineHeight: '1.6' }}>
              {isEdit ? 'Article updated successfully!' : 'Article published successfully!'}
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#dc2626', marginBottom: '10px', fontSize: '1.1rem' }}>
              ⚠️ Error Publishing Article
            </h3>
            <p style={{ color: '#991b1b', lineHeight: '1.6' }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc2626',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0 10px',
              marginLeft: '15px'
            }}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">News Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter news title"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            disabled={loading}
          >
            <option value="የሃገር">የሃገር</option>
            <option value="የከተማ">የከተማ</option>
            <option value="የክፍለ-ከተማ">የክፍለ-ከተማ</option>
            <option value="የወረዳ">የወረዳ</option>
            <option value="ያልተመደበ">ያልተመደበ</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your article content here..."
            required
            disabled={loading}
            rows={15}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: '1.6'
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mainImage">Article Images (Multiple selection supported)</label>
          <input
            type="file"
            id="mainImage"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            disabled={loading || uploading}
          />
          <small>Select multiple images and choose which one to use as the main featured image</small>
          
          {imagePreviews.length > 0 && (
            <div className="article-images-section">
              <p className="images-count">
                Selected: {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''}
                {selectedImageIndex !== null && ` - Using image #${selectedImageIndex + 1} as featured`}
              </p>
              
              <div className="article-images-grid">
                {imagePreviews.map((preview, index) => (
                  <div 
                    key={index} 
                    className={`article-image-item ${selectedImageIndex === index ? 'selected' : ''}`}
                    onClick={() => selectMainImage(index)}
                  >
                    <img src={preview.url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      disabled={loading || uploading}
                    >
                      ✕
                    </button>
                    {selectedImageIndex === index && (
                      <div className="featured-badge">Featured</div>
                    )}
                    <span className="image-filename">{preview.name}</span>
                  </div>
                ))}
              </div>
              
              <p className="selection-help">
                💡 Click on an image to set it as the featured image for this article
              </p>
            </div>
          )}
          
          {mainImagePreview && imagePreviews.length === 0 && (
            <div className="image-preview">
              <img src={mainImagePreview} alt="Current image" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="video_url">YouTube Video URL (optional)</label>
          <input
            type="url"
            id="video_url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || uploading}
          >
            {loading ? (uploading ? 'Uploading...' : 'Publishing...') : (isEdit ? 'Update News' : 'Publish News')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
