import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AboutManager.css';
import { useToast } from '../../contexts/ToastContext';

const AboutManager = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title_am: '',
    title_en: '',
    content_am: '',
    content_en: '',
    metadata: {}
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('የክፍሎች መረጃ ማግኘት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      title_am: section.title_am || '',
      title_en: section.title_en || '',
      content_am: section.content_am || '',
      content_en: section.content_en || '',
      metadata: section.metadata || {}
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('about_page')
        .update(formData)
        .eq('id', editingSection.id);

      if (error) throw error;
      
      toast.success('ክፍሉ በትክክል ተስተካክሏል!');
      resetForm();
      fetchSections();
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('ክፍሉ ማስቀመጥ አልተቻለም: ' + error.message);
    }
  };

  const getSectionLabel = (sectionKey) => {
    const labels = {
      'overview': 'Sub-City: Overview Section',
      'vision': 'Sub-City: Vision Statement',
      'mission': 'Sub-City: Mission Statement',
      'values': 'Sub-City: Core Values',
      'statistics': 'Sub-City: Statistics',
      'map': 'Sub-City: Map Section',
      'media_overview': 'Media Office: Overview Section',
      'media_vision': 'Media Office: Vision Statement',
      'media_mission': 'Media Office: Mission Statement',
      'media_values': 'Media Office: Core Values',
      'media_statistics': 'Media Office: Statistics'
    };
    return labels[sectionKey] || sectionKey;
  };

  const resetForm = () => {
    setFormData({
      title_am: '',
      title_en: '',
      content_am: '',
      content_en: '',
      metadata: {}
    });
    setEditingSection(null);
    setShowForm(false);
  };

  const handleMetadataChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  const addValueItem = () => {
    const items = formData.metadata.items || [];
    items.push({ am: '', en: '' });
    handleMetadataChange('items', items);
  };

  const updateValueItem = (index, field, value) => {
    const items = [...(formData.metadata.items || [])];
    items[index][field] = value;
    handleMetadataChange('items', items);
  };

  const deleteValueItem = (index) => {
    const items = [...(formData.metadata.items || [])];
    items.splice(index, 1);
    handleMetadataChange('items', items);
  };

  const addStatItem = () => {
    const stats = formData.metadata.stats || [];
    stats.push({ number: '', label_am: '', label_en: '' });
    handleMetadataChange('stats', stats);
  };

  const updateStatItem = (index, field, value) => {
    const stats = [...(formData.metadata.stats || [])];
    stats[index][field] = value;
    handleMetadataChange('stats', stats);
  };

  const deleteStatItem = (index) => {
    const stats = [...(formData.metadata.stats || [])];
    stats.splice(index, 1);
    handleMetadataChange('stats', stats);
  };

  if (loading) {
    return <div className="loading">እየተጫነ ነው...</div>;
  }

  return (
    <div className="about-manager">
      <div className="manager-header">
        <h2>የስለ እኛ ገጽ አስተዳደር / About Page Management</h2>
        {showForm && (
          <button 
            className="btn-secondary"
            onClick={resetForm}
          >
            ሰርዝ / Cancel
          </button>
        )}
      </div>

      {showForm ? (
        <form className="about-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>✏️ {editingSection?.title_am || editingSection?.section_key}</h3>
            <span className="section-type">{getSectionLabel(editingSection?.section_key)}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📝 ርዕስ (አማርኛ) / Title (Amharic) *</label>
              <input
                type="text"
                value={formData.title_am}
                onChange={(e) => setFormData({ ...formData, title_am: e.target.value })}
                placeholder="የክፍሉ ርዕስ በአማርኛ"
                required
              />
            </div>

            <div className="form-group">
              <label>📝 Title (English)</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Section title in English"
              />
            </div>
          </div>

          {/* Show content fields for overview, vision, mission */}
          {(editingSection?.section_key === 'overview' || 
            editingSection?.section_key === 'vision' || 
            editingSection?.section_key === 'mission' ||
            editingSection?.section_key === 'media_overview' || 
            editingSection?.section_key === 'media_vision' || 
            editingSection?.section_key === 'media_mission') && (
            <>
              <div className="form-group">
                <label>📄 ይዘት (አማርኛ) / Content (Amharic) *</label>
                <textarea
                  value={formData.content_am}
                  onChange={(e) => setFormData({ ...formData, content_am: e.target.value })}
                  rows="8"
                  placeholder="የክፍሉን ዝርዝር መረጃ በአማርኛ ያስገቡ..."
                  required
                />
                <small>💡 Use double line breaks (Enter twice) to create new paragraphs</small>
              </div>

              <div className="form-group">
                <label>📄 Content (English)</label>
                <textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  rows="8"
                  placeholder="Enter section content in English..."
                />
              </div>
            </>
          )}

          {/* Values section - list of items */}
          {(editingSection?.section_key === 'values' || editingSection?.section_key === 'media_values') && (
            <div className="form-group">
              <label>⭐ እሴቶች ዝርዝር / Values List</label>
              <div className="list-items">
                {(formData.metadata.items || []).map((item, index) => (
                  <div key={index} className="list-item">
                    <span className="item-number">{index + 1}</span>
                    <input
                      type="text"
                      placeholder="እሴቱ በአማርኛ"
                      value={item.am}
                      onChange={(e) => updateValueItem(index, 'am', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value in English"
                      value={item.en}
                      onChange={(e) => updateValueItem(index, 'en', e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn-delete-item"
                      onClick={() => deleteValueItem(index)}
                      title="Delete this value"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addValueItem}>
                  + አዲስ እሴት ጨምር / Add New Value
                </button>
              </div>
            </div>
          )}

          {/* Statistics section - list of stats */}
          {(editingSection?.section_key === 'statistics' || editingSection?.section_key === 'media_statistics') && (
            <div className="form-group">
              <label>📊 የስታቲስቲክስ ዝርዝር / Statistics List</label>
              <div className="list-items">
                {(formData.metadata.stats || []).map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="item-number">{index + 1}</span>
                    <input
                      type="text"
                      placeholder="12 or 500+"
                      value={stat.number}
                      onChange={(e) => updateStatItem(index, 'number', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="መለያ (አማርኛ)"
                      value={stat.label_am}
                      onChange={(e) => updateStatItem(index, 'label_am', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Label (English)"
                      value={stat.label_en}
                      onChange={(e) => updateStatItem(index, 'label_en', e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn-delete-item"
                      onClick={() => deleteStatItem(index)}
                      title="Delete this statistic"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addStatItem}>
                  + አዲስ ስታቲስቲክስ ጨምር / Add New Statistic
                </button>
              </div>
            </div>
          )}

          {/* Map section - map URL */}
          {editingSection?.section_key === 'map' && (
            <div className="form-group">
              <label>🗺️ Google Maps Embed URL</label>
              <input
                type="url"
                value={formData.metadata.map_url || ''}
                onChange={(e) => handleMetadataChange('map_url', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <small>💡 How to get: Google Maps → Share → Embed map → Copy HTML → Paste the URL from src="..."</small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              ለውጦችን አስቀምጥ / Save Changes
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ሰርዝ / Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="sections-list">
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                <div className="section-icon">
                  {section.metadata?.icon || '📄'}
                </div>
                <h3>{section.title_am}</h3>
                <p className="section-english">{section.title_en}</p>
                <span className="section-label">{getSectionLabel(section.section_key)}</span>
                <div className="card-footer">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(section)}
                  >
                    ✏️ አርትዕ / Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutManager;

