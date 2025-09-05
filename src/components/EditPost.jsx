import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setTitle(postData.title);
          setContent(postData.content);
          setAuthor(postData.author);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !author) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        title,
        content,
        author
      });
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading post...</div>;

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button type="button" onClick={() => navigate(`/post/${id}`)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;