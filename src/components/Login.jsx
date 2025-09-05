import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (error) {
      setError('Failed to log in with Google');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Welcome to BlogHub</h2>
          {error && <div className="error">{error}</div>}
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading} 
            className="btn-google"
          >
            <span className="google-icon">G</span>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          <p className="auth-note">
            Sign in to start writing and reading amazing stories
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;