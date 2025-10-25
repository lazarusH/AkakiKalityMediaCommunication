import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      const { data, error: signInError } = await signIn(email, password);
      
      console.log('Sign in response:', { data, error: signInError });
      
      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Provide user-friendly error messages
        let errorMessage = signInError.message;
        
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check and try again.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address first.';
        } else if (errorMessage.includes('User not found')) {
          errorMessage = 'No account found with this email.';
        }
        
        setError(errorMessage);
        setLoading(false);
      } else {
        // Success! Navigate to admin
        console.log('Login successful!');
        navigate('/admin');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('Connection error. Please check your internet and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Akaki Kality Subcity Administration</p>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@akakikality.gov.et"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>For authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

