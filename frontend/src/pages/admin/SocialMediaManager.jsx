import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import './SocialMediaManager.css';

const platformIcons = {
  facebook: '📘',
  twitter: '🐦',
  youtube: '📺',
  telegram: '✈️',
  instagram: '📷',
  linkedin: '💼',
  tiktok: '🎵',
  whatsapp: '💬',
  other: '🔗'
};

const platformNames = {
  facebook: 'Facebook',
  twitter: 'Twitter (X)',
  youtube: 'YouTube',
  telegram: 'Telegram',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  other: 'Other'
};

const SocialMediaManager = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    platform: 'facebook',
    url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_media_links')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error('የማህበራዊ ሚዲያ አገናኞች ማምጣት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('social_media_links')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('አገናኝ ተስተካክሏል!');
      } else {
        const { error } = await supabase
          .from('social_media_links')
          .insert([formData]);

        if (error) throw error;
        toast.success('አዲስ አገናኝ ተጨምሯል!');
      }

      resetForm();
      fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('አገናኝ ማስቀመጥ አልተቻለም: ' + error.message);
    }
  };

  const handleEdit = (link) => {
    setFormData({
      platform: link.platform,
      url: link.url,
      display_order: link.display_order,
      is_active: link.is_active
    });
    setEditingId(link.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('social_media_links')
        .delete()
        .eq('id', confirmDelete.id);

      if (error) throw error;
      toast.success('አገናኝ ተሰርዟል!');
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('አገናኝ መሰረዝ አልተቻለም');
    } finally {
      setConfirmDelete(null);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('social_media_links')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchLinks();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('ሁኔታ መቀየር አልተቻለም');
    }
  };

  const resetForm = () => {
    setFormData({
      platform: 'facebook',
      url: '',
      display_order: 0,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">እየተጫነ ነው...</div>;
  }

  return (
    <div className="social-media-manager">
      <div className="manager-header">
        <div className="header-left">
          <h2>የማህበራዊ ሚዲያ አገናኞች</h2>
          <span className="stat-badge">{links.length} አገናኞች</span>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '📋 ዝርዝር አሳይ' : '+ አዲስ አገናኝ ጨምር'}
        </button>
      </div>

      {showForm ? (
        <form className="social-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'አገናኝ አርትዕ' : 'አዲስ አገናኝ'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>የማህበራዊ ሚዲያ አይነት *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
              >
                {Object.entries(platformNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {platformIcons[key]} {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>የአሰላለፍ ቁጥር</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                placeholder="0"
              />
              <small>ዝቅተኛ ቁጥር በመጀመሪያ ይታያል</small>
            </div>
          </div>

          <div className="form-group">
            <label>የድረ-ገፅ አድራሻ (URL) *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://facebook.com/your-page"
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>ንቁ (Active)</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'ለውጦችን አስቀምጥ' : 'አገናኝ ጨምር'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ሰርዝ
            </button>
          </div>
        </form>
      ) : (
        <div className="links-grid">
          {links.map((link) => (
            <div key={link.id} className={`link-card ${!link.is_active ? 'inactive' : ''}`}>
              <div className="link-header">
                <div className="platform-info">
                  <span className="platform-icon">{platformIcons[link.platform]}</span>
                  <span className="platform-name">{platformNames[link.platform]}</span>
                </div>
                <div className="status-badge">
                  {link.is_active ? (
                    <span className="badge active">ንቁ</span>
                  ) : (
                    <span className="badge inactive">ቦዝኗል</span>
                  )}
                </div>
              </div>

              <div className="link-url">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </div>

              <div className="link-meta">
                <span className="display-order">ቅደም ተከተል: {link.display_order}</span>
              </div>

              <div className="link-actions">
                <button 
                  className="btn-toggle"
                  onClick={() => toggleActive(link.id, link.is_active)}
                  title={link.is_active ? 'Deactivate' : 'Activate'}
                >
                  {link.is_active ? '👁️' : '🚫'}
                </button>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(link)}
                  title="አርትዕ"
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => setConfirmDelete({ id: link.id, name: platformNames[link.platform] })}
                  title="ሰርዝ"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="empty-state">
              <p>ምንም የማህበራዊ ሚዲያ አገናኞች የሉም።</p>
              <p>አዲስ አገናኝ ለመጨመር ከላይ ያለውን ቁልፍ ይጫኑ።</p>
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="አገናኝን ይሰርዙ? / Delete Link?"
        message={`Are you sure you want to delete ${confirmDelete?.name || 'this link'}?`}
        confirmText="Delete"
        cancelText="Cancel"
        icon="🗑️"
      />
    </div>
  );
};

export default SocialMediaManager;

