import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cleanupDuplicateCategories } from '../utils/cleanupCategories';

const NewPost = () => {
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    category: '',
    community: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCommunities, setUserCommunities] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await cleanupDuplicateCategories();
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Remove duplicates by name
        const uniqueCategories = categoriesData.filter((category, index, self) => 
          index === self.findIndex(c => c.name === category.name)
        );
        
        setCategories(uniqueCategories);
        
        // Pre-select category from URL params
        const urlParams = new URLSearchParams(location.search);
        const categoryName = urlParams.get('category');
        if (categoryName) {
          setFormData(prev => ({ ...prev, category: categoryName }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [location.search]);

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch communities where user is member or creator
        const communitiesQuery = query(collection(db, 'communities'));
        const snapshot = await getDocs(communitiesQuery);
        const communities = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(community => 
            community.members?.includes(currentUser.uid) || 
            community.createdBy === currentUser.uid
          );
        setUserCommunities(communities);
        
        // Pre-select community from URL params
        const urlParams = new URLSearchParams(location.search);
        const communityId = urlParams.get('community');
        if (communityId) {
          setFormData(prev => ({ ...prev, community: communityId }));
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };
    
    fetchUserCommunities();
  }, [currentUser, location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in title and content');
      return;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || currentUser.displayName || currentUser.email,
        authorId: currentUser.uid,
        category: formData.category,
        timestamp: serverTimestamp()
      };
      
      // Add community data if selected
      if (formData.community) {
        postData.communityId = formData.community;
        const selectedCommunity = userCommunities.find(c => c.id === formData.community);
        if (selectedCommunity) {
          postData.communityName = selectedCommunity.name;
        }
      }
      
      await addDoc(collection(db, 'posts'), postData);
      
      // Update community post count if posted to community
      if (formData.community) {
        const communityRef = doc(db, 'communities', formData.community);
        await updateDoc(communityRef, {
          postCount: increment(1)
        });
      }
      
      // Update category post count
      if (formData.category) {
        const categoryQuery = query(
          collection(db, 'categories'),
          where('name', '==', formData.category)
        );
        const categorySnapshot = await getDocs(categoryQuery);
        if (!categorySnapshot.empty) {
          const categoryRef = doc(db, 'categories', categorySnapshot.docs[0].id);
          await updateDoc(categoryRef, {
            postCount: increment(1)
          });
        }
      }
      
      navigate('/home');
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="create-post-container">
        <div className="create-post-header">
          <h1>Create New Post</h1>
          <p>Share your thoughts and ideas with the BlogHub community</p>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-grid">
          <div className="form-main">
            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <label>Author Name</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Your name (optional)"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter your post title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="content"
                  placeholder="Write your post content here..."
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Publishing...' : 'Publish Post'}
                </button>
                <button type="button" onClick={() => navigate('/home')} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <div className="form-sidebar">
            <div className="sidebar-section">
              <h3>Post Settings</h3>
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Community</label>
                <select
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                >
                  <option value="">Select a community (optional)</option>
                  {userCommunities.map(community => (
                    <option key={community.id} value={community.id}>{community.name}</option>
                  ))}
                </select>
                {userCommunities.length === 0 && (
                  <p style={{fontSize: '0.8rem', color: '#666', marginTop: '0.5rem'}}>
                    Join or create communities to post in them
                  </p>
                )}
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Writing Tips</h3>
              <ul className="sidebar-tips">
                <li>Write a compelling title that grabs attention</li>
                <li>Use clear and concise language</li>
                <li>Break up long paragraphs for readability</li>
                <li>Add relevant categories and communities</li>
                <li>Proofread before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;