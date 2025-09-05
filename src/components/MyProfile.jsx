import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName || 'Anonymous User',
    email: currentUser?.email || '',
    bio: 'Passionate writer and blogger sharing thoughts with the world.',
    location: 'New York, USA',
    website: 'https://myblog.com',
    joinDate: 'January 2024',
    postsCount: 12,
    likesCount: 45,
    commentsCount: 28
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save profile changes to Firebase
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">☺</span>
            </div>
            <div className="profile-info">
              <h1>{profile.displayName}</h1>
              <p className="profile-email">{profile.email}</p>
              <p className="profile-join-date">Joined {profile.joinDate}</p>
            </div>
            <button onClick={handleEdit} className="btn-primary">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{profile.postsCount}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{profile.likesCount}</span>
              <span className="stat-label">Likes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{profile.commentsCount}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>

          <div className="profile-details">
            <h2>About</h2>
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                  />
                </div>
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="profile-view">
                <p><strong>Bio:</strong> {profile.bio}</p>
                <p><strong>Location:</strong> {profile.location}</p>
                <p><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default MyProfile;