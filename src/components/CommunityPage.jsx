import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // Fetch community details
        const communityDoc = await getDoc(doc(db, 'communities', id));
        if (communityDoc.exists()) {
          const communityData = { id: communityDoc.id, ...communityDoc.data() };
          setCommunity(communityData);
          setIsJoined(communityData.members?.includes(currentUser?.uid) || false);
        }

        // Fetch community posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('communityId', '==', id)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching community data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommunityData();
    }
  }, [id, currentUser]);

  const handleJoinLeave = async () => {
    if (!currentUser || !community) return;

    try {
      const communityRef = doc(db, 'communities', id);
      
      if (isJoined) {
        // Leave community
        await updateDoc(communityRef, {
          members: arrayRemove(currentUser.uid),
          memberCount: community.memberCount - 1
        });
        setIsJoined(false);
        setCommunity(prev => ({ ...prev, memberCount: prev.memberCount - 1 }));
      } else {
        // Join community
        await updateDoc(communityRef, {
          members: arrayUnion(currentUser.uid),
          memberCount: community.memberCount + 1
        });
        setIsJoined(true);
        setCommunity(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  if (loading) return <div className="loading">Loading community...</div>;
  if (!community) return <div className="page-container"><h1>Community not found</h1></div>;

  return (
    <div className="page-container">
      <div className="community-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8e8e8',
        borderRadius: '12px'
      }}>
        <div className="community-icon" style={{
          width: '80px',
          height: '80px',
          fontSize: '2rem'
        }}>
          {community.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1>{community.name}</h1>
          <p style={{ color: '#666', margin: '0.5rem 0' }}>{community.description}</p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            {community.memberCount} members • {community.postCount} posts • 
            Created by {community.createdByName}
          </p>
        </div>
        {currentUser && (
          <button 
            onClick={handleJoinLeave}
            className={isJoined ? 'btn-secondary' : 'btn-primary'}
          >
            {isJoined ? 'Leave' : 'Join'}
          </button>
        )}
      </div>

      <div className="page-header">
        <h2>Posts</h2>
        {isJoined && (
          <Link to={`/new?community=${id}`} className="btn-primary">
            Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h3>No posts yet!</h3>
          <p>Be the first to share something in this community.</p>
          {isJoined && (
            <Link to={`/new?community=${id}`} className="btn-primary">
              Create First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
              <p className="post-meta">
                By {post.author} • {new Date(post.timestamp?.toDate()).toLocaleDateString()}
              </p>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
              <div className="post-actions">
                <Link to={`/post/${post.id}`} className="btn-primary">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;