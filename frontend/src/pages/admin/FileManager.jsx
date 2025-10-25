import { useEffect, useState } from 'react';
import { supabase, STORAGE_BUCKETS, getPublicUrl } from '../../lib/supabase';
import './FileManager.css';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'PDF',
    category: 'other',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-detect file type
      const ext = selectedFile.name.split('.').pop().toUpperCase();
      if (['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'ZIP'].includes(ext)) {
        setFormData({ ...formData, type: ext });
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !formData.title) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.FILES_AND_FORMS)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const fileUrl = getPublicUrl(STORAGE_BUCKETS.FILES_AND_FORMS, filePath);

      const { error: insertError } = await supabase
        .from('filesandforms')
        .insert([{
          title: formData.title,
          type: formData.type,
          category: formData.category,
          file_url: fileUrl,
          created_at: new Date().toISOString(),
        }]);

      if (insertError) throw insertError;

      // Success!
      setFormData({ title: '', type: 'PDF', category: 'other' });
      setFile(null);
      setShowUploadForm(false);
      
      // Show success message
      alert('✅ File uploaded successfully!');
      
      // Refresh the files list
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('❌ Failed to upload file: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('filesandforms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFiles(files.filter(f => f.id !== id));
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const getFileIcon = (type) => {
    const typeMap = {
      'PDF': '📄',
      'DOC': '📝',
      'DOCX': '📝',
      'XLS': '📊',
      'XLSX': '📊',
      'PPT': '📊',
      'PPTX': '📊',
      'ZIP': '🗂️',
      'default': '📎'
    };
    return typeMap[type] || typeMap['default'];
  };

  return (
    <div className="file-manager">
      <div className="manager-header">
        <h1>Manage Files & Forms</h1>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary"
        >
          {showUploadForm ? 'Cancel' : '+ Upload File'}
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="upload-form">
          <h3>Upload New File</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter file title"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              disabled={uploading}
            >
              <option value="brochures">📘 Brochures</option>
              <option value="posters">📋 Posters</option>
              <option value="flyers">📄 Flyers</option>
              <option value="other">📁 Other Files</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">File Type *</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              disabled={uploading}
            >
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="DOCX">DOCX</option>
              <option value="XLS">XLS</option>
              <option value="XLSX">XLSX</option>
              <option value="PPT">PPT</option>
              <option value="PPTX">PPTX</option>
              <option value="ZIP">ZIP</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file">File *</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
              disabled={uploading}
            />
            {file && (
              <p className="file-info">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="no-data">
          <p>No files yet. Upload your first file!</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-icon">{getFileIcon(file.type)}</div>
              <div className="file-info">
                <h3 className="file-title">{file.title}</h3>
                <div className="file-meta-row">
                  <span className="file-category-badge category-{file.category}">
                    {file.category === 'brochures' ? '📘 Brochures' : 
                     file.category === 'posters' ? '📋 Posters' :
                     file.category === 'flyers' ? '📄 Flyers' : '📁 Other'}
                  </span>
                  <span className="file-type">{file.type}</span>
                </div>
                <span className="file-date">
                  {new Date(file.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="file-actions">
                <a 
                  href={file.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(file.id, file.title)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManager;

