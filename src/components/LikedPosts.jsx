import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate fetching liked posts
    const fetchLikedPosts = async () => {
      // This would fetch from Firebase where user has liked posts
      const mockLikedPosts = [
        {
          id: '1',
          title: 'Getting Started with React Hooks',
          author: 'John Doe',
          timestamp: new Date(),
          content: 'React Hooks have revolutionized the way we write React components...',
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Best Travel Destinations 2024',
          author: 'Jane Smith',
          timestamp: new Date(),
          content: 'Discover the most amazing places to visit this year...',
          category: 'Travel'
        }
      ];
      
      setTimeout(() => {
        setLikedPosts(mockLikedPosts);
        setLoading(false);
      }, 1000);
    };

    fetchLikedPosts();
  }, [currentUser]);

  if (loading) return <div className="loading">Loading liked posts...</div>;

  return (
    <div className="page-container">
      <h1>Liked Posts</h1>
      <p className="page-description">Posts you've liked and want to revisit.</p>
      
      {likedPosts.length === 0 ? (
        <div className="no-posts">
          <h2>No liked posts yet!</h2>
          <p>Start exploring and like posts that interest you.</p>
          <Link to="/home" className="btn-primary">Explore Posts</Link>
        </div>
      ) : (
        <div className="posts-feed">
          {likedPosts.map(post => (
            <div key={post.id} className="post-card">
              <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
              <p className="post-meta">By {post.author} • {post.timestamp.toLocaleDateString()}</p>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
              <div className="post-actions">
                <Link to={`/post/${post.id}`} className="btn-primary">Read More</Link>
                <button className="btn-secondary">Unlike</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPosts;