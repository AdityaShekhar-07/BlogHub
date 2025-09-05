import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const MyCommunity = () => {
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMyCommunities = async () => {
      if (!currentUser) return;
      
      try {
        const q = query(
          collection(db, 'communities'),
          where('createdBy', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const communities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyCommunities(communities);
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCommunities();
  }, [currentUser]);

  const copyShareLink = (communityId) => {
    const shareLink = `${window.location.origin}/community/${communityId}`;
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  if (loading) return <div className="loading">Loading your communities...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Communities</h1>
        <Link to="/create-community" className="btn-primary">Create Community</Link>
      </div>
      
      {myCommunities.length === 0 ? (
        <div className="no-posts">
          <h2>No communities created yet!</h2>
          <p>Create your first community and start building your audience.</p>
          <Link to="/create-community" className="btn-primary">Create Community</Link>
        </div>
      ) : (
        <div className="posts-feed">
          {myCommunities.map(community => (
            <div key={community.id} className="post-card">
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <div className="community-icon" style={{backgroundColor: '#007bff'}}>
                  {community.icon}
                </div>
                <div>
                  <h2>{community.name}</h2>
                  <p className="post-meta">
                    Created on {new Date(community.createdAt?.toDate()).toLocaleDateString()} • 
                    {community.memberCount} members • {community.postCount} posts
                  </p>
                </div>
              </div>
              
              <p className="post-excerpt">{community.description}</p>
              
              <div className="post-actions">
                <Link to={`/community/${community.id}`} className="btn-primary">View Community</Link>
                <button 
                  onClick={() => copyShareLink(community.id)} 
                  className="btn-secondary"
                >
                  Share Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCommunity;