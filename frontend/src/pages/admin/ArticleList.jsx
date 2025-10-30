import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import { supabase } from '../../lib/supabase';
import './ArticleList.css';

const ArticleList = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  // Auto-refresh when coming back to this page
  useEffect(() => {
    const handleFocus = () => {
      fetchArticles();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', confirmDelete.id);

      if (error) throw error;
      
      setArticles(articles.filter(a => a.id !== confirmDelete.id));
      toast.success('Article deleted successfully!');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article. Please try again.');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="article-list-admin">
      <div className="list-header">
        <h1>Manage News</h1>
        <Link to="/admin/articles/new" className="btn-primary">
          + Add News
        </Link>
      </div>

      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          ሁሉም / All
        </button>
        <button 
          className={`filter-btn ${filter === 'የሃገር' ? 'active' : ''}`}
          onClick={() => setFilter('የሃገር')}
        >
          የሃገር
        </button>
        <button 
          className={`filter-btn ${filter === 'የከተማ' ? 'active' : ''}`}
          onClick={() => setFilter('የከተማ')}
        >
          የከተማ
        </button>
        <button 
          className={`filter-btn ${filter === 'የክፍለ-ከተማ' ? 'active' : ''}`}
          onClick={() => setFilter('የክፍለ-ከተማ')}
        >
          የክፍለ-ከተማ
        </button>
        <button 
          className={`filter-btn ${filter === 'የወረዳ' ? 'active' : ''}`}
          onClick={() => setFilter('የወረዳ')}
        >
          የወረዳ
        </button>
        <button 
          className={`filter-btn ${filter === 'ያልተመደበ' ? 'active' : ''}`}
          onClick={() => setFilter('ያልተመደበ')}
        >
          ያልተመደበ
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="no-data">
          <p>No articles found. Create your first article!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="articles-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="title-cell">
                    <Link to={`/article/${article.id}`} target="_blank">
                      {article.title}
                    </Link>
                  </td>
                  <td>
                    <span className="category-badge">{article.category}</span>
                  </td>
                  <td className="date-cell">
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="actions-cell">
                    <Link 
                      to={`/admin/articles/edit/${article.id}`} 
                      className="btn-edit"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => setConfirmDelete({ id: article.id, title: article.title })}
                      className="btn-delete"
                    >
                      Delete
                    </button>
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
        title="Delete Article?"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        icon="🗑️"
      />
    </div>
  );
};

export default ArticleList;

