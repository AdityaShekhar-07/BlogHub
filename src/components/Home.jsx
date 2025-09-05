import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeDefaultCommunities } from '../utils/initCommunities';
import { initializeDefaultCategories } from '../utils/initCategories';
import { useSearch } from '../contexts/SearchContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { searchTerm } = useSearch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initializeDefaultCommunities();
    initializeDefaultCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const otherUsersPosts = postsData.filter(post => 
          !user || post.authorId !== user.uid
        );
        setAllPosts(otherUsersPosts);
        setPosts(otherUsersPosts);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = {};
        categoriesSnapshot.docs.forEach(doc => {
          categoriesData[doc.data().name] = doc.data();
        });
        setCategories(categoriesData);

        // Fetch communities
        const communitiesQuery = query(collection(db, 'communities'), orderBy('memberCount', 'desc'));
        const communitiesSnapshot = await getDocs(communitiesQuery);
        const communitiesData = communitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCommunities(communitiesData.slice(0, 4));

        // Fetch joined communities
        if (user) {
          const joinedCommunitiesData = communitiesData.filter(community => 
            community.members?.includes(user.uid)
          );
          setJoinedCommunities(joinedCommunitiesData.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPosts(filteredPosts);
    }
  }, [searchTerm, allPosts]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading">Loading posts...</div>
    </div>
  );

  return (
    <div className="homepage-container">
      <div className="homepage-left">
        <div className="sidebar-section">
          <Link to="/home" className="sidebar-item active">
            <span className="sidebar-icon">⌂</span>
            Home
          </Link>
          <Link to="/new" className="sidebar-item">
            <span className="sidebar-icon">✎</span>
            New Post
          </Link>
          <Link to="/popular" className="sidebar-item">
            <span className="sidebar-icon">★</span>
            Popular
          </Link>
          <Link to="/categories" className="sidebar-item">
            <span className="sidebar-icon">≡</span>
            Categories
          </Link>
          <Link to="/my-blogs" className="sidebar-item">
            <span className="sidebar-icon">▦</span>
            My Blogs
          </Link>
          <Link to="/liked-posts" className="sidebar-item">
            <span className="sidebar-icon">♥</span>
            Liked Posts
          </Link>
          <Link to="/my-comments" className="sidebar-item">
            <span className="sidebar-icon">…</span>
            My Comments
          </Link>
          <Link to="/my-profile" className="sidebar-item">
            <span className="sidebar-icon">☺</span>
            My Profile
          </Link>
          <Link to="/my-community" className="sidebar-item">
            <span className="sidebar-icon">◆</span>
            My Community
          </Link>
          <Link to="/settings" className="sidebar-item">
            <span className="sidebar-icon">⚙</span>
            Settings
          </Link>
        </div>
      </div>

      <div className="homepage-center">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts from other users yet!</h2>
            <p>Discover amazing content from the community.</p>
            <Link to="/categories" className="btn-primary">Explore Categories</Link>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <h2><Link to={`/post/${post.id}`}>{post.title}</Link></h2>
                <div className="post-meta-container">
                  <p className="post-meta">By {post.author} • {new Date(post.timestamp?.toDate()).toLocaleDateString()} at {new Date(post.timestamp?.toDate()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                  {post.category && categories[post.category] && (
                    <div className="post-tags">
                      <Link to={`/category/${post.category}`} className="post-tag category-tag">
                        <span className="tag-icon" style={{backgroundColor: categories[post.category].color}}>
                          {categories[post.category].icon}
                        </span>
                        {categories[post.category].name}
                      </Link>
                    </div>
                  )}
                </div>
                <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
                <div className="post-actions">
                  <Link to={`/post/${post.id}`} className="btn-primary">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="homepage-right">
        <div className="popular-communities">
          <h3>Popular Communities</h3>
          <ul className="community-list">
            {communities.map(community => (
              <li key={community.id} className="community-item" onClick={() => window.location.href = `/community/${community.id}`}>
                <div className="community-icon">{community.icon}</div>
                <div>
                  <div>{community.name}</div>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>{community.memberCount} members</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="joined-communities">
          <h3>Communities Joined</h3>
          {joinedCommunities.length === 0 ? (
            <p style={{color: '#666', fontSize: '0.9rem'}}>Join communities to see them here</p>
          ) : (
            <ul className="community-list">
              {joinedCommunities.map(community => (
                <li key={community.id} className="community-item" onClick={() => window.location.href = `/community/${community.id}`}>
                  <div className="community-icon">{community.icon}</div>
                  <span>{community.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;