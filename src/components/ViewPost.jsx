import { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const canEdit = currentUser && post && (currentUser.uid === post.authorId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/');
          return;
        }

        // Fetch comments
        const commentsQuery = query(
          collection(db, 'comments'),
          orderBy('timestamp', 'desc')
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(comment => comment.postId === id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      const commentData = {
        postId: id,
        content: newComment.trim(),
        author: currentUser.displayName || currentUser.email,
        authorId: currentUser.uid,
        timestamp: serverTimestamp()
      };
      
      await addDoc(collection(db, 'comments'), commentData);
      
      // Create notification for post author
      if (post.authorId !== currentUser.uid) {
        await addDoc(collection(db, 'notifications'), {
          userId: post.authorId,
          postId: id,
          postTitle: post.title,
          commenterName: currentUser.displayName || currentUser.email,
          commenterId: currentUser.uid,
          type: 'comment',
          read: false,
          timestamp: serverTimestamp()
        });
      }
      
      // Add to local state immediately
      setComments(prev => [{
        ...commentData,
        id: Date.now().toString(),
        timestamp: { toDate: () => new Date() }
      }, ...prev]);
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="view-post">
      <article className="post-content">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <p>By {post.author} • {new Date(post.timestamp?.toDate()).toLocaleDateString()}</p>
        </div>
        <div className="post-body">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
      
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        {currentUser && currentUser.uid !== post.authorId && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              required
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">
                    {new Date(comment.timestamp?.toDate()).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="post-actions">
        {canEdit && (
          <>
            <Link to={`/edit/${post.id}`} className="btn-secondary">Edit Post</Link>
            <button onClick={handleDelete} className="btn-danger">Delete Post</button>
          </>
        )}
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
};

export default ViewPost;