import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (error) {
      setError('Failed to sign up with Google');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h2>Join BlogHub</h2>
          {error && <div className="error">{error}</div>}
          <button 
            onClick={handleGoogleSignup} 
            disabled={loading} 
            className="btn-google"
          >
            <span className="google-icon">G</span>
            {loading ? 'Creating Account...' : 'Sign up with Google'}
          </button>
          <p className="auth-note">
            Create your account to start sharing your stories with the world
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;