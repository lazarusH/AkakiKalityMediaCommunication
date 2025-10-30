import { useEffect, useState } from 'react';
import { supabase, STORAGE_BUCKETS, getPublicUrl } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import './FileManager.css';

const FileManager = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    category: 'other',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      const previews = files.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.name.split('.').pop().toUpperCase()
      }));
      setFilePreviews(previews);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !formData.title) {
      toast.warning('እባክዎ ቢያንስ አንድ ፋይል ይምረጡ እና ርዕስ ያስገቡ / Please select at least one file and enter a title');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Upload all files
      for (let i = 0; i < selectedFiles.length; i++) {
        try {
          const file = selectedFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKETS.FILES_AND_FORMS)
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const fileUrl = getPublicUrl(STORAGE_BUCKETS.FILES_AND_FORMS, filePath);

          // Create title with number if multiple files
          const fileTitle = selectedFiles.length === 1 
            ? formData.title 
            : `${formData.title} (${i + 1}/${selectedFiles.length})`;

          const { error: insertError } = await supabase
            .from('filesandforms')
            .insert([{
              title: fileTitle,
              type: file.name.split('.').pop().toUpperCase(),
              category: formData.category,
              file_url: fileUrl,
              created_at: new Date().toISOString(),
            }]);

          if (insertError) throw insertError;
          successCount++;
        } catch (fileError) {
          console.error(`Error uploading file ${i + 1}:`, fileError);
          failCount++;
        }
      }

      // Reset form
      setFormData({ title: '', description: '', type: 'PDF', category: 'other' });
      setSelectedFiles([]);
      setFilePreviews([]);
      setShowUploadForm(false);
      
      // Show result message
      if (successCount > 0 && failCount === 0) {
        toast.success(`${successCount} ፋይል${successCount > 1 ? 'ቾች' : ''} በተሳካ ሁኔታ ተጭኗል! / Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}!`);
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`${successCount} ተጭኗል፣ ${failCount} አልተሳካም። / Uploaded ${successCount}, but ${failCount} failed.`);
      } else {
        toast.error('ፋይሎችን መጫን አልተሳካም። / Failed to upload files.');
      }
      
      // Refresh the files list
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('ፋይሎችን መጫን አልተሳካም። / Failed to upload files: ' + (error.message || 'Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('filesandforms')
        .delete()
        .eq('id', confirmDelete.id);

      if (error) throw error;

      setFiles(files.filter(f => f.id !== confirmDelete.id));
      toast.success('ፋይል በተሳካ ሁኔታ ተሰርዟል! / File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('ፋይልን ማጥፋት አልተቻለም። / Failed to delete file. Please try again.');
    } finally {
      setConfirmDelete(null);
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
          <h3>📤 ፋይሎችን ይጫኑ / Upload Files</h3>
          <p className="form-help">በአንድ ጊዜ በርካታ ፋይሎችን መምረጥ ይችላሉ / You can select multiple files at once</p>
          
          <div className="form-group">
            <label htmlFor="title">ርዕስ / Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ርዕስ ያስገቡ / Enter title (will be applied to all files)"
              required
              disabled={uploading}
            />
            <small>ለብዙ ፋይሎች ቁጥር በራስ-ሰር ይመደባል / For multiple files, each will be numbered automatically</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">መግለጫ / Description (አማራጭ / Optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="የፋይሉን አጭር መግለጫ / Brief description of the file(s)"
              rows="3"
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">ምድብ / Category *</label>
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
            <label htmlFor="file">ፋይሎች / Files * (በርካታ ምርጫ ይደገፋል)</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              multiple
              required
              disabled={uploading}
              accept="*/*"
            />
            <small>ብዙ ፋይሎችን ለመምረጥ Ctrl (በMac ላይ Cmd) ይጫኑ / Hold Ctrl (Cmd on Mac) to select multiple files</small>
          </div>

          {filePreviews.length > 0 && (
            <div className="file-previews">
              <p className="preview-count">የተመረጡ / Selected: {filePreviews.length} ፋይል{filePreviews.length > 1 ? 'ቾች' : ''} / file{filePreviews.length > 1 ? 's' : ''}</p>
              <div className="files-list">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="file-preview-item">
                    <span className="file-icon">{getFileIcon(preview.type)}</span>
                    <div className="file-details">
                      <span className="file-name">{preview.name}</span>
                      <span className="file-size">{preview.size}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      title="ፋይልን አስወግድ / Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading 
              ? `እየጫነ ነው ${selectedFiles.length} ${selectedFiles.length > 1 ? 'ፋይሎችን' : 'ፋይልን'}... / Uploading...` 
              : `${selectedFiles.length > 0 ? selectedFiles.length : ''} ${selectedFiles.length > 1 ? 'ፋይሎችን' : 'ፋይልን'} ጫን / Upload`
            }
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
        <div className="files-table-container">
          <table className="files-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="file-table-icon">{getFileIcon(file.type)}</td>
                  <td className="file-table-title">{file.title}</td>
                  <td className="file-table-category">{file.category}</td>
                  <td className="file-table-date">{new Date(file.created_at).toLocaleDateString('en-US')}</td>
                  <td className="file-table-actions">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-view">View</a>
                    <button onClick={() => setConfirmDelete({ id: file.id, title: file.title })} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="ፋይልን ይሰርዙ? / Delete File?"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        icon="🗑️"
      />
    </div>
  );
};

export default FileManager;

