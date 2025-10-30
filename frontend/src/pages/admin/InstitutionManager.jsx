import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { optimizeImage, getOptimizationSettings } from '../../utils/imageOptimizer';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import './InstitutionManager.css';

const InstitutionManager = () => {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    vision: '',
    mission: '',
    functions: '',
    structure: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    image_url: '',
    type: 'office'
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      
      // Fetch all offices
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('type', 'office')
        .order('title');

      if (error) throw error;

      setInstitutions(data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('የተቋማት መረጃ ማግኘት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      console.log('Optimizing institution image...');
      
      // Optimize the image before uploading (reduces size while maintaining quality)
      const optimizedFile = await optimizeImage(file, getOptimizationSettings('institution'));
      
      // Use .webp extension for optimized images
      const fileName = `${Math.random()}.webp`;
      const filePath = `institutions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, optimizedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      toast.success('ምስል በትክክል ተጭኗል! / Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('ምስል መጫን አልተቻለም / Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove default placeholder/template text from payload
    const visionDefault = 'በአቃቂ ቃሊቲ ክፍለ ከተማ ውስጥ ከፍተኛ ጥራት ያለው አገልግሎት በመስጠት ለማህበረሰቡ የተሻለ ህይወት ለማምጣት መሥራት።';
    const missionDefault = 'በሙያዊነት እና ተገቢ በሆነ መንገድ ሕዝቡን ማገልገል፣ ልማታዊ ሥራዎችን በተቀናጀ መንገድ ማከናወን እና የተቋሙን ተግባራት በብቃት መወጣት።';
    const functionsDefault = 'የተቋሙን ዋና ተግባራት እና ኃላፊነቶች መወጣት\nየማህበረሰቡን ፍላጎት ማሟላት እና አገልግሎት መስጠት\nከሌሎች ተቋማት ጋር በመተባበር የልማት ሥራዎችን ማከናወን\nየአመራር እና የቁጥጥር ስርዓቶችን ማጠናከር';
    const structureDefault = '[ርዕስ] የተቋቋመው የአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር አወቃቀር ስር ነው። በተለያዩ ክፍሎች እና ቡድኖች የተደራጀ ሲሆን በሙያዊ ባለሙያዎች የሚመራ ነው።';

    const payload = {
      slug: formData.slug?.trim(),
      title: formData.title?.trim(),
      description: formData.description?.trim() || null,
      vision: (formData.vision?.trim() && formData.vision !== visionDefault) ? formData.vision.trim() : null,
      mission: (formData.mission?.trim() && formData.mission !== missionDefault) ? formData.mission.trim() : null,
      functions: (formData.functions?.trim() && formData.functions !== functionsDefault) ? formData.functions.trim() : null,
      structure: (formData.structure?.trim() && formData.structure !== structureDefault) ? formData.structure.trim() : null,
      contact_phone: formData.contact_phone?.trim() || null,
      contact_email: formData.contact_email?.trim() || null,
      contact_address: formData.contact_address?.trim() || null,
      image_url: formData.image_url || null,
      type: 'office',
    };
    try {
      if (editingId) {
        // Update existing institution
        const { error } = await supabase
          .from('institutions')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('ተቋም መረጃ ተስተካክሏል!');
      } else {
        // Create new institution
        const { error} = await supabase
          .from('institutions')
          .insert([payload]);
        if (error) throw error;
        toast.success('አዲስ ተቋም ተጨምሯል!');
      }
      resetForm();
      fetchInstitutions();
    } catch (error) {
      console.error('Error saving institution:', error);
      toast.error('ተቋም ማስቀመጥ አልተቻለም: ' + error.message);
    }
  };

  const handleEdit = (institution) => {
    // Convert null values to empty strings for controlled inputs
    const cleanedData = Object.keys(institution).reduce((acc, key) => {
      acc[key] = institution[key] === null ? '' : institution[key];
      return acc;
    }, {});
    
    setFormData(cleanedData);
    setEditingId(institution.id);
    setShowForm(true);
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', confirmDelete.id);

      if (error) throw error;
      toast.success('ተቋም ተሰርዟል!');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('ተቋም መሰረዝ አልተቻለም');
    } finally {
      setConfirmDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      description: '',
      vision: '',
      mission: '',
      functions: '',
      structure: '',
      contact_phone: '',
      contact_email: '',
      contact_address: '',
      image_url: '',
      type: 'office'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">እየተጫነ ነው...</div>;
  }

  return (
    <div className="institution-manager">
      <div className="manager-header">
        <div className="header-left">
          <h2>የተቋማት አስተዳደር</h2>
          <div className="stats-badges">
            <span className="stat-badge offices">
              {institutions.length} ፅ/ቤቶች
            </span>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '📋 ዝርዝር አሳይ' : '+ አዲስ ፅ/ቤት ጨምር'}
        </button>
      </div>

      {showForm ? (
        <form className="institution-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'ፅ/ቤት አርትዕ' : 'አዲስ ፅ/ቤት'}</h3>

          <div className="form-group">
            <label>Slug (URL) *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="council-office"
              required
            />
            <small>የተቋሙ የዩአርኤል መታወቂያ (ምሳሌ: council-office)</small>
          </div>

          <div className="form-group">
            <label>ርዕስ *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="የተቋሙ ሙሉ ስም"
              required
            />
          </div>

          <div className="form-group">
            <label>መግቢያ መግለጫ *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="[ርዕስ] በአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር ውስጥ ያለ አስፈላጊ የሥራ ክፍል ነው።"
              rows="4"
              required
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>
              📝 Default template: "[Title] በአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር ውስጥ ያለ አስፈላጊ የሥራ ክፍል ነው።"
            </small>
          </div>

          <div className="form-group">
            <label>ራዕይ (Vision)</label>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="በአቃቂ ቃሊቲ ክፍለ ከተማ ውስጥ ከፍተኛ ጥራት ያለው አገልግሎት በመስጠት ለማህበረሰቡ የተሻለ ህይወት ለማምጣት መሥራት።"
              rows="3"
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>
              📝 Default: "በአቃቂ ቃሊቲ ክፍለ ከተማ ውስጥ ከፍተኛ ጥራት ያለው አገልግሎት በመስጠት ለማህበረሰቡ የተሻለ ህይወት ለማምጣት መሥራት።"
            </small>
          </div>

          <div className="form-group">
            <label>ተልዕኮ (Mission)</label>
            <textarea
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="በሙያዊነት እና ተገቢ በሆነ መንገድ ሕዝቡን ማገልገል፣ ልማታዊ ሥራዎችን በተቀናጀ መንገድ ማከናወን እና የተቋሙን ተግባራት በብቃት መወጣት።"
              rows="3"
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>
              📝 Default: "በሙያዊነት እና ተገቢ በሆነ መንገድ ሕዝቡን ማገልገል፣ ልማታዊ ሥራዎችን በተቀናጀ መንገድ ማከናወን..."
            </small>
          </div>

          <div className="form-group">
            <label>ዋና ተግባራት (Functions)</label>
            <textarea
              value={formData.functions}
              onChange={(e) => setFormData({ ...formData, functions: e.target.value })}
              placeholder={"የተቋሙን ዋና ተግባራት እና ኃላፊነቶች መወጣት\nየማህበረሰቡን ፍላጎት ማሟላት እና አገልግሎት መስጠት\nከሌሎች ተቋማት ጋር በመተባበር የልማት ሥራዎችን ማከናወን\nየአመራር እና የቁጥጥር ስርዓቶችን ማጠናከር"}
              rows="6"
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>
              📝 እያንዳንዱን ተግባር በአዲስ መስመር (Enter) ይለዩ። <br/>
              Default functions: "የተቋሙን ዋና ተግባራት እና ኃላፊነቶች መወጣት" / "የማህበረሰቡን ፍላጎት ማሟላት..." etc.
            </small>
          </div>

          <div className="form-group">
            <label>የአደረጃጀት መዋቅር (Structure)</label>
            <textarea
              value={formData.structure}
              onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
              placeholder="[ርዕስ] የተቋቋመው የአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር አወቃቀር ስር ነው። በተለያዩ ክፍሎች እና ቡድኖች የተደራጀ ሲሆን በሙያዊ ባለሙያዎች የሚመራ ነው።"
              rows="3"
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>
              📝 Default: "[Title] የተቋቋመው የአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር አወቃቀር ስር ነው። በተለያዩ ክፍሎች እና ቡድኖች የተደራጀ..."
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ስልክ</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+251 11 XXX XXXX"
              />
              <small style={{color: '#888', fontSize: '0.85rem'}}>📞 Default: +251 11 XXX XXXX</small>
            </div>

            <div className="form-group">
              <label>ኢሜል</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="info@akakikality.gov.et"
              />
              <small style={{color: '#888', fontSize: '0.85rem'}}>📧 Default: info@akakikality.gov.et</small>
            </div>
          </div>

          <div className="form-group">
            <label>አድራሻ</label>
            <input
              type="text"
              value={formData.contact_address}
              onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
              placeholder="አቃቂ ቃሊቲ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ"
            />
            <small style={{color: '#888', fontSize: '0.85rem'}}>📍 Default: አቃቂ ቃሊቲ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ</small>
          </div>

          <div className="form-group">
            <label>ምስል / ሎጎ</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p className="uploading-text">እየተጫነ ነው...</p>}
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'ለውጦችን አስቀምጥ' : 'ፅ/ቤት ጨምር'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ሰርዝ
            </button>
          </div>
        </form>
      ) : (
        <div className="institutions-list">
          <div className="table-section files-table-container" style={{overflowX:'auto'}}>
            <table className="institutions-table">
              <thead>
                <tr>
                  <th className="col-image">ምስል</th>
                  <th className="col-title">ርዕስ</th>
                  <th className="col-slug">Slug</th>
                  <th className="col-actions">እርምጃዎች</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst) => (
                  <tr key={inst.id} className="office-row">
                    <td className="col-image">
                      {inst.image_url ? (
                        <img src={inst.image_url} alt={inst.title} className="table-img" />
                      ) : (
                        <div className="no-image office-placeholder">🏢</div>
                      )}
                    </td>
                    <td className="col-title">{inst.title}</td>
                    <td className="col-slug">
                      <code className="slug-code">{inst.slug}</code>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(inst)} title="አርትዕ">
                          ✏️
                        </button>
                        <button className="btn-delete" onClick={() => setConfirmDelete({ id: inst.id, title: inst.title })} title="ሰርዝ">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="ተቋምን ይሰርዙ? / Delete Institution?"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        icon="🗑️"
      />
    </div>
  );
};

export default InstitutionManager;

