import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMyComments = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch user's comments
        const commentsQuery = query(
          collection(db, 'comments'),
          where('authorId', '==', currentUser.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched comments:', commentsData);

        // Fetch post details for each comment
        const commentsWithPosts = await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const postDoc = await getDoc(doc(db, 'posts', comment.postId));
              if (postDoc.exists()) {
                return {
                  ...comment,
                  post: { id: postDoc.id, ...postDoc.data() }
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching post:', error);
              return null;
            }
          })
        );

        const filteredComments = commentsWithPosts.filter(comment => comment !== null);
        console.log('Comments with posts:', filteredComments);
        setComments(filteredComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComments();
  }, [currentUser]);

  if (loading) return <div className="loading">Loading your comments...</div>;

  return (
    <div className="page-container">
      <h1>My Comments</h1>
      <p className="page-description">Posts where you've shared your thoughts and engaged with the community.</p>
      
      {comments.length === 0 ? (
        <div className="no-posts">
          <h2>No comments yet!</h2>
          <p>Start engaging with the community by commenting on posts.</p>
          <Link to="/home" className="btn-primary">Explore Posts</Link>
        </div>
      ) : (
        <div className="posts-feed">
          {comments.map(comment => (
            <div key={comment.id} className="post-card">
              <h2><Link to={`/post/${comment.post.id}`}>{comment.post.title}</Link></h2>
              <p className="post-meta">By {comment.post.author} • {new Date(comment.post.timestamp?.toDate()).toLocaleDateString()}</p>
              <p className="post-excerpt">{comment.post.content.substring(0, 100)}...</p>
              
              <div className="my-comment">
                <h4>Your comment:</h4>
                <p>"{comment.content}"</p>
                <small>Commented on {new Date(comment.timestamp?.toDate()).toLocaleDateString()}</small>
              </div>
              
              <div className="post-actions">
                <Link to={`/post/${comment.post.id}`} className="btn-primary">View Post</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComments;