import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const Popular = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) return <div className="loading">Loading popular posts...</div>;

  return (
    <div className="page-container">
      <h1>Popular Posts</h1>
      {posts.length === 0 ? (
        <div className="no-posts">
          <h2>No popular posts yet!</h2>
          <p>Be the first to create trending content.</p>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
              <p className="post-meta">By {post.author} • {new Date(post.timestamp?.toDate()).toLocaleDateString()}</p>
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

export default Popular;