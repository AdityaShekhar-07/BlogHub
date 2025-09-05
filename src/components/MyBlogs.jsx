import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [communities, setCommunities] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch posts
        const q = query(
          collection(db, 'posts'), 
          where('authorId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        console.log('Fetched posts:', postsData);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = {};
        categoriesSnapshot.docs.forEach(doc => {
          categoriesData[doc.id] = doc.data();
        });
        setCategories(categoriesData);
        console.log('Fetched categories:', categoriesData);

        // Fetch communities
        const communitiesSnapshot = await getDocs(collection(db, 'communities'));
        const communitiesData = {};
        communitiesSnapshot.docs.forEach(doc => {
          communitiesData[doc.id] = doc.data();
        });
        setCommunities(communitiesData);
        console.log('Fetched communities:', communitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) return <div className="loading">Loading your blogs...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Blogs</h1>
        <Link to="/new" className="btn-primary">Create New Blog</Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="no-posts">
          <h2>You haven't created any blogs yet!</h2>
          <p>Start sharing your thoughts with the world.</p>
          <Link to="/new" className="btn-primary">Write Your First Blog</Link>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
              <div className="post-meta-container">
                <p className="post-meta">Published on {new Date(post.timestamp?.toDate()).toLocaleDateString()}</p>
                <div className="post-tags">
                  {post.category && categories[post.category] && (
                    <Link to={`/category/${post.category}`} className="post-tag category-tag">
                      <span className="tag-icon" style={{backgroundColor: categories[post.category].color}}>
                        {categories[post.category].icon}
                      </span>
                      {categories[post.category].name}
                    </Link>
                  )}
                  {(post.community || post.communityId) && (
                    (() => {
                      const communityId = post.communityId || post.community;
                      const community = communities[communityId];
                      return community ? (
                        <Link to={`/community/${communityId}`} className="post-tag community-tag">
                          <span className="tag-icon community-icon">
                            {community.name.charAt(0)}
                          </span>
                          {community.name}
                        </Link>
                      ) : null;
                    })()
                  )}
                </div>
              </div>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
              <div className="post-actions">
                <Link to={`/post/${post.id}`} className="btn-secondary">View</Link>
                <Link to={`/edit/${post.id}`} className="btn-primary">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;