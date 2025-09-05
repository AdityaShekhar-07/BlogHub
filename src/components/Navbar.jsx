import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSearch } from '../contexts/SearchContext';
import { useNotifications } from '../contexts/NotificationContext';

const Navbar = () => {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">BlogHub</Link>
        <div className="nav-center">
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input 
              type="text" 
              placeholder="Search posts by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="create-dropdown">
            <button className="create-btn" onClick={() => setShowCreateDropdown(!showCreateDropdown)}>
              <span className="create-text">Create</span>
              <span className="create-icon">+</span>
            </button>
            {showCreateDropdown && (
              <div className="create-dropdown-menu">
                <Link to="/new" className="dropdown-item" onClick={() => setShowCreateDropdown(false)}>
                  <span className="dropdown-icon">▦</span>
                  <span>Post</span>
                </Link>
                <Link to="/create-community" className="dropdown-item" onClick={() => setShowCreateDropdown(false)}>
                  <span className="dropdown-icon">◆</span>
                  <span>Community</span>
                </Link>
              </div>
            )}
          </div>

        </div>
        <div className="nav-links">
          {currentUser ? (
            <>
              <div className="notification-dropdown">
                <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                  </svg>
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown-menu">
                    <div className="notification-header">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="mark-all-read">Mark all read</button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 5).map(notification => (
                          <div 
                            key={notification.id} 
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            onClick={() => {
                              markAsRead(notification.id);
                              navigate(`/post/${notification.postId}`);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="notification-content">
                              <strong>{notification.commenterName}</strong> commented on your post
                              <div className="notification-title">"{notification.postTitle}"</div>
                              <div className="notification-time">
                                {new Date(notification.timestamp?.toDate()).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <span className="nav-user">Welcome, {currentUser.email}</span>
              <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? '☀' : '☽'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;