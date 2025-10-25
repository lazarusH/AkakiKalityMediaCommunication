import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './ArticleList.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(articles.filter(a => a.id !== id));
      alert('Article deleted successfully!');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    }
  };

  return (
    <div className="article-list-admin">
      <div className="list-header">
        <h1>Manage Articles</h1>
        <Link to="/admin/articles/new" className="btn-primary">
          + New Article
        </Link>
      </div>

      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'Local' ? 'active' : ''}`}
          onClick={() => setFilter('Local')}
        >
          Local
        </button>
        <button 
          className={`filter-btn ${filter === 'National' ? 'active' : ''}`}
          onClick={() => setFilter('National')}
        >
          National
        </button>
        <button 
          className={`filter-btn ${filter === 'Uncategorized' ? 'active' : ''}`}
          onClick={() => setFilter('Uncategorized')}
        >
          Uncategorized
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
                      onClick={() => handleDelete(article.id, article.title)}
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
    </div>
  );
};

export default ArticleList;

