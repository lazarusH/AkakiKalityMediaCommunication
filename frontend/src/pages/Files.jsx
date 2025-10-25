import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LatestNewsSlider from '../components/LatestNewsSlider';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [selectedCategory, files]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('filesandforms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = () => {
    if (selectedCategory === 'all') {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(files.filter(file => file.category === selectedCategory));
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      brochures: '📘',
      posters: '📋',
      flyers: '📄',
      other: '📁'
    };
    return icons[category] || icons.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      brochures: 'Brochures',
      posters: 'Posters',
      flyers: 'Flyers',
      other: 'Other Files'
    };
    return labels[category] || 'Other';
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📊',
      pptx: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      zip: '📦',
      default: '📁'
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const isImage = (url) => {
    if (!url) return false;
    const ext = getFileType(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
  };

  const isPDF = (url) => {
    if (!url) return false;
    const ext = getFileType(url);
    return ext === 'pdf';
  };

  const handleDownload = (fileUrl, title) => {
    window.open(fileUrl, '_blank');
  };

  const handleView = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="files-page">
      <div className="files-header">
        <h1>ፋይሎች እና ቅጾች</h1>
        <p>Files & Forms • Download important documents and forms</p>
      </div>

      {/* Category Filter */}
      {!loading && files.length > 0 && (
        <div className="category-filter">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            📂 All Files ({files.length})
          </button>
          <button
            className={`category-btn ${selectedCategory === 'brochures' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('brochures')}
          >
            📘 Brochures ({files.filter(f => f.category === 'brochures').length})
          </button>
          <button
            className={`category-btn ${selectedCategory === 'posters' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('posters')}
          >
            📋 Posters ({files.filter(f => f.category === 'posters').length})
          </button>
          <button
            className={`category-btn ${selectedCategory === 'flyers' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('flyers')}
          >
            📄 Flyers ({files.filter(f => f.category === 'flyers').length})
          </button>
          <button
            className={`category-btn ${selectedCategory === 'other' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('other')}
          >
            📁 Other ({files.filter(f => f.category === 'other').length})
          </button>
        </div>
      )}

      <div className="files-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>ፋይሎችን በመጫን ላይ... / Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h2>ምንም ፋይል የለም</h2>
            <p>No files available yet. Check back later!</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{getCategoryIcon(selectedCategory)}</div>
            <h2>No {getCategoryLabel(selectedCategory)} Found</h2>
            <p>There are no files in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Files Grid */}
            <div className="files-grid">
              {filteredFiles.map((file) => {
                const fileType = getFileType(file.file_url);
                const isImg = isImage(file.file_url);
                const isPdf = isPDF(file.file_url);

                return (
                  <div key={file.id} className="file-card">
                    <div className="file-preview">
                      {isImg ? (
                        <img
                          src={file.file_url}
                          alt={file.title}
                          className="image-preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : isPdf ? (
                        <div className="pdf-preview-placeholder">
                          <div className="file-icon-large">📄</div>
                          <span>PDF Document</span>
                        </div>
                      ) : (
                        <div className="file-icon-large">{getFileIcon(fileType)}</div>
                      )}
                      
                      <div className="file-overlay">
                        {(isImg || isPdf) && (
                          <button
                            onClick={() => handleView(file)}
                            className="preview-btn"
                          >
                            👁️ View
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(file.file_url, file.title)}
                          className="download-btn-overlay"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                    
                    <div className="file-info">
                      <h3 className="file-title">{file.title}</h3>
                      {file.description && (
                        <p className="file-description">{file.description}</p>
                      )}
                      <div className="file-meta">
                        <span className={`file-category-badge category-${file.category || 'other'}`}>
                          {getCategoryIcon(file.category || 'other')} {getCategoryLabel(file.category || 'other')}
                        </span>
                        <span className="file-type-badge">
                          {getFileIcon(fileType)} {fileType.toUpperCase()}
                        </span>
                        <span className="file-date">
                          {new Date(file.created_at).toLocaleDateString('am-ET', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Preview Modal */}
            {selectedFile && (
              <div className="preview-modal" onClick={() => setSelectedFile(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{selectedFile.title}</h2>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="close-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="modal-body">
                    {isPDF(selectedFile.file_url) ? (
                      <iframe
                        src={`${selectedFile.file_url}#view=FitH`}
                        className="full-preview-iframe"
                        title={selectedFile.title}
                      />
                    ) : isImage(selectedFile.file_url) ? (
                      <img
                        src={selectedFile.file_url}
                        alt={selectedFile.title}
                        className="full-preview-image"
                      />
                    ) : (
                      <div className="preview-unavailable">
                        <div className="unavailable-icon">📄</div>
                        <h3>Preview Not Available</h3>
                        <p>This file type cannot be previewed. Please download to view.</p>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={() => handleDownload(selectedFile.file_url, selectedFile.title)}
                      className="modal-download-btn"
                    >
                      ⬇️ ይዉረዱ / Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <LatestNewsSlider />
    </div>
  );
};

export default Files;
