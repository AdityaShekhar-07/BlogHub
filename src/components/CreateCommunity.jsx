import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const CreateCommunity = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    rules: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in community name and description');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const communityData = {
        ...formData,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email,
        createdAt: new Date(),
        memberCount: 1,
        postCount: 0,
        members: [currentUser.uid],
        icon: formData.name.charAt(0).toUpperCase(),
        isPublic: formData.privacy === 'public'
      };
      
      const docRef = await addDoc(collection(db, 'communities'), communityData);
      
      const shareableLink = `${window.location.origin}/community/${docRef.id}`;
      alert(`Community created! Share this link: ${shareableLink}`);
      
      navigate('/my-community');
    } catch (error) {
      setError('Failed to create community');
      console.error('Error creating community:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="create-post-container">
        <div className="create-post-header">
          <h1>Create Your Community</h1>
          <p>Build a space for people to connect around shared interests</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-grid">
          <div className="form-main">
            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <label>Community Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter community name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe what your community is about..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Community Rules</label>
                <textarea
                  name="rules"
                  placeholder="Set guidelines for your community (optional)"
                  value={formData.rules}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Creating...' : 'Create Community'}
                </button>
                <button type="button" onClick={() => navigate('/home')} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <div className="form-sidebar">
            <div className="sidebar-section">
              <h3>Community Settings</h3>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Privacy</label>
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Community Tips</h3>
              <ul className="sidebar-tips">
                <li>Choose a clear, memorable name</li>
                <li>Write a detailed description</li>
                <li>Set clear community rules</li>
                <li>Select the right category</li>
                <li>Consider privacy settings carefully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;