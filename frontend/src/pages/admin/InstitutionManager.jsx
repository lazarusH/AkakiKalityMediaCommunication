import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './InstitutionManager.css';

const InstitutionManager = () => {
  const [institutions, setInstitutions] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'pool', 'office'
  const [selectedPool, setSelectedPool] = useState('all'); // for filtering offices by pool
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
    type: 'office',
    pool_id: ''
  });

  useEffect(() => {
    fetchInstitutions();
    fetchPools();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      
      // Fetch all institutions first
      const { data: allInstitutions, error } = await supabase
        .from('institutions')
        .select('*')
        .order('title');

      if (error) throw error;

      // Map pool information manually (self-referencing)
      const institutionsWithPools = allInstitutions.map(inst => {
        if (inst.type === 'office' && inst.pool_id) {
          const poolData = allInstitutions.find(p => p.id === inst.pool_id);
          return {
            ...inst,
            pool: poolData ? { id: poolData.id, title: poolData.title } : null
          };
        }
        return inst;
      });

      setInstitutions(institutionsWithPools || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      alert('የተቋማት መረጃ ማግኘት አልተቻለም');
    } finally {
      setLoading(false);
    }
  };

  const fetchPools = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, title')
        .eq('type', 'pool')
        .order('title');

      if (error) throw error;
      setPools(data || []);
    } catch (error) {
      console.error('Error fetching pools:', error);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `institutions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      alert('ምስል በትክክል ተጭኗል!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('ምስል መጫን አልተቻለም');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Remove the 'pool' property (it's just for display, not a real database column)
      const { pool, ...dataToSave } = formData;
      
      if (editingId) {
        // Update existing institution
        const { error } = await supabase
          .from('institutions')
          .update(dataToSave)
          .eq('id', editingId);

        if (error) throw error;
        alert('ተቋም መረጃ ተስተካክሏል!');
      } else {
        // Create new institution
        const { error } = await supabase
          .from('institutions')
          .insert([dataToSave]);

        if (error) throw error;
        alert('አዲስ ተቋም ተጨምሯል!');
      }

      resetForm();
      fetchInstitutions();
    } catch (error) {
      console.error('Error saving institution:', error);
      alert('ተቋም ማስቀመጥ አልተቻለም: ' + error.message);
    }
  };

  const handleEdit = (institution) => {
    // Extract only the database fields, excluding the 'pool' display property
    const { pool, ...editData } = institution;
    
    // Convert null values to empty strings for controlled inputs
    const cleanedData = Object.keys(editData).reduce((acc, key) => {
      acc[key] = editData[key] === null ? '' : editData[key];
      return acc;
    }, {});
    
    setFormData(cleanedData);
    setEditingId(institution.id);
    setShowForm(true);
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('እርግጠኛ ነዎት ይህን ተቋም መሰረዝ ይፈልጋሉ?')) return;

    try {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('ተቋም ተሰርዟል!');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      alert('ተቋም መሰረዝ አልተቻለም');
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
      type: 'office',
      pool_id: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">እየተጫነ ነው...</div>;
  }

  // Filter institutions based on selected filters
  const filteredInstitutions = institutions.filter(inst => {
    if (filterType === 'pool') return inst.type === 'pool';
    if (filterType === 'office') {
      if (selectedPool === 'all') return inst.type === 'office';
      return inst.type === 'office' && inst.pool_id === selectedPool;
    }
    return true; // 'all'
  });

  // Group institutions by pool for grid view
  const groupedByPool = pools.reduce((acc, pool) => {
    acc[pool.id] = {
      pool,
      offices: institutions.filter(inst => inst.type === 'office' && inst.pool_id === pool.id)
    };
    return acc;
  }, {});

  return (
    <div className="institution-manager">
      <div className="manager-header">
        <div className="header-left">
          <h2>የተቋማት አስተዳደር</h2>
          <div className="stats-badges">
            <span className="stat-badge pools">
              {pools.length} ፑሎች
            </span>
            <span className="stat-badge offices">
              {institutions.filter(i => i.type === 'office').length} ፅ/ቤቶች
            </span>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '📋 ዝርዝር አሳይ' : '+ አዲስ ተቋም ጨምር'}
        </button>
      </div>

      {!showForm && (
        <div className="manager-controls">
          <div className="filter-section">
            <label>አይነት:</label>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                ሁሉም ({institutions.length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'pool' ? 'active' : ''}`}
                onClick={() => setFilterType('pool')}
              >
                ፑሎች ({pools.length})
              </button>
              <button 
                className={`filter-btn ${filterType === 'office' ? 'active' : ''}`}
                onClick={() => setFilterType('office')}
              >
                ፅ/ቤቶች ({institutions.filter(i => i.type === 'office').length})
              </button>
            </div>
          </div>

          {filterType === 'office' && (
            <div className="filter-section">
              <label>ፑል:</label>
              <select 
                value={selectedPool} 
                onChange={(e) => setSelectedPool(e.target.value)}
                className="pool-filter-select"
              >
                <option value="all">ሁሉም ፑሎች</option>
                {pools.map(pool => (
                  <option key={pool.id} value={pool.id}>
                    {pool.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {showForm ? (
        <form className="institution-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'ተቋም አርትዕ' : 'አዲስ ተቋም'}</h3>

          <div className="form-row">
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
              <label>አይነት *</label>
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value, pool_id: '' });
                }}
                required
              >
                <option value="office">ፅ/ቤት (Office)</option>
                <option value="pool">ፑል (Pool)</option>
              </select>
            </div>
          </div>

          {formData.type === 'office' && (
            <div className="form-group">
              <label>የትኛው ፑል? (Which Pool?) *</label>
              <select
                value={formData.pool_id}
                onChange={(e) => setFormData({ ...formData, pool_id: e.target.value })}
                required
              >
                <option value="">-- ፑል ይምረጡ (Select Pool) --</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.title}
                  </option>
                ))}
              </select>
              <small>ይህ ፅ/ቤት የትኛው ፑል ስር እንደሚወድቅ ይምረጡ</small>
            </div>
          )}

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
              {editingId ? 'ለውጦችን አስቀምጥ' : 'ተቋም ጨምር'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              ሰርዝ
            </button>
          </div>
        </form>
      ) : (
        <div className="institutions-list">
          {filterType === 'all' ? (
            // Show grouped by pools when viewing all
            <>
              {pools.length > 0 && (
                <div className="table-section">
                  <div className="table-section-header pools-header">
                    <h3>🏛️ ፑሎች (Pools)</h3>
                    <span className="count-badge">{pools.length}</span>
                  </div>
                  <table className="institutions-table">
                    <thead>
                      <tr>
                        <th className="col-image">ምስል</th>
                        <th className="col-title">ርዕስ</th>
                        <th className="col-slug">Slug</th>
                        <th className="col-offices">ፅ/ቤቶች</th>
                        <th className="col-actions">እርምጃዎች</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pools.map((pool) => (
                        <tr key={pool.id} className="pool-row">
                          <td className="col-image">
                            {pool.image_url ? (
                              <img src={pool.image_url} alt={pool.title} className="table-img" />
                            ) : (
                              <div className="no-image pool-placeholder">🏛️</div>
                            )}
                          </td>
                          <td className="col-title">
                            <strong>{pool.title}</strong>
                          </td>
                          <td className="col-slug">
                            <code className="slug-code">{pool.slug}</code>
                          </td>
                          <td className="col-offices">
                            <span className="office-count-badge">
                              {groupedByPool[pool.id]?.offices.length || 0} ፅ/ቤቶች
                            </span>
                          </td>
                          <td className="col-actions">
                            <div className="action-buttons">
                              <button className="btn-edit" onClick={() => handleEdit(pool)} title="አርትዕ">
                                ✏️
                              </button>
                              <button className="btn-delete" onClick={() => handleDelete(pool.id)} title="ሰርዝ">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {Object.entries(groupedByPool).map(([poolId, data]) => (
                data.offices.length > 0 && (
                  <div key={poolId} className="table-section">
                    <div className="table-section-header offices-header">
                      <h3>📂 {data.pool.title}</h3>
                      <span className="count-badge">{data.offices.length} ፅ/ቤቶች</span>
                    </div>
                    <table className="institutions-table">
                      <thead>
                        <tr>
                          <th className="col-image">ምስል</th>
                          <th className="col-title">ርዕስ</th>
                          <th className="col-slug">Slug</th>
                          <th className="col-type">አይነት</th>
                          <th className="col-actions">እርምጃዎች</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.offices.map((office) => (
                          <tr key={office.id} className="office-row">
                            <td className="col-image">
                              {office.image_url ? (
                                <img src={office.image_url} alt={office.title} className="table-img" />
                              ) : (
                                <div className="no-image office-placeholder">🏢</div>
                              )}
                            </td>
                            <td className="col-title">{office.title}</td>
                            <td className="col-slug">
                              <code className="slug-code">{office.slug}</code>
                            </td>
                            <td className="col-type">
                              <span className="badge office">ፅ/ቤት</span>
                            </td>
                            <td className="col-actions">
                              <div className="action-buttons">
                                <button className="btn-edit" onClick={() => handleEdit(office)} title="አርትዕ">
                                  ✏️
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(office.id)} title="ሰርዝ">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ))}
            </>
          ) : (
            // Show simple table for filtered views
            <div className="table-section">
              <table className="institutions-table">
                <thead>
                  <tr>
                    <th className="col-image">ምስል</th>
                    <th className="col-title">ርዕስ</th>
                    <th className="col-slug">Slug</th>
                    <th className="col-type">አይነት</th>
                    {filterType !== 'pool' && <th className="col-pool">ፑል</th>}
                    <th className="col-actions">እርምጃዎች</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map((inst) => (
                    <tr key={inst.id} className={`${inst.type}-row`}>
                      <td className="col-image">
                        {inst.image_url ? (
                          <img src={inst.image_url} alt={inst.title} className="table-img" />
                        ) : (
                          <div className={`no-image ${inst.type}-placeholder`}>
                            {inst.type === 'pool' ? '🏛️' : '🏢'}
                          </div>
                        )}
                      </td>
                      <td className="col-title">
                        {inst.type === 'pool' ? <strong>{inst.title}</strong> : inst.title}
                      </td>
                      <td className="col-slug">
                        <code className="slug-code">{inst.slug}</code>
                      </td>
                      <td className="col-type">
                        <span className={`badge ${inst.type}`}>
                          {inst.type === 'pool' ? 'ፑል' : 'ፅ/ቤት'}
                        </span>
                      </td>
                      {filterType !== 'pool' && (
                        <td className="col-pool">
                          {inst.type === 'office' && inst.pool ? (
                            <span className="pool-tag">{inst.pool.title}</span>
                          ) : (
                            <span className="no-pool">—</span>
                          )}
                        </td>
                      )}
                      <td className="col-actions">
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEdit(inst)} title="አርትዕ">
                            ✏️
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(inst.id)} title="ሰርዝ">
                            🗑️
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
      )}
    </div>
  );
};

export default InstitutionManager;

