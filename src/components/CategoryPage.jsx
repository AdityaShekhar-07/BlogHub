import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category details
        const categoriesQuery = query(
          collection(db, 'categories'),
          where('name', '==', categoryName)
        );
        const categorySnapshot = await getDocs(categoriesQuery);
        
        if (!categorySnapshot.empty) {
          const categoryData = { id: categorySnapshot.docs[0].id, ...categorySnapshot.docs[0].data() };
          setCategory(categoryData);
        }

        // Fetch posts in this category
        const postsQuery = query(
          collection(db, 'posts'),
          where('category', '==', categoryName)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryData();
    }
  }, [categoryName]);

  if (loading) return <div className="loading">Loading category...</div>;
  if (!category) return <div className="page-container"><h1>Category not found</h1></div>;

  return (
    <div className="page-container">
      <div className="category-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        borderLeft: `4px solid ${category.color}`
      }}>
        <div style={{
          fontSize: '3rem',
          color: category.color
        }}>
          {category.icon}
        </div>
        <div>
          <h1>{category.name}</h1>
          <p style={{ color: '#666', margin: '0.5rem 0' }}>{category.description}</p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            {posts.length} posts in this category
          </p>
        </div>
      </div>

      <div className="page-header">
        <h2>Posts in {category.name}</h2>
        <Link to={`/new?category=${category.name}`} className="btn-primary">
          Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h3>No posts yet!</h3>
          <p>Be the first to share something in the {category.name} category.</p>
          <Link to={`/new?category=${category.name}`} className="btn-primary">
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>
              <p className="post-meta">
                By {post.author} • {new Date(post.timestamp?.toDate()).toLocaleDateString()}
                {post.communityName && ` • in ${post.communityName}`}
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

export default CategoryPage;