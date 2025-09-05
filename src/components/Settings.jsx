import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    publicProfile: true,
    showEmail: false,
    language: 'English',
    accentColor: '#007bff',
    fontFamily: 'system',
    backgroundTheme: 'default',
    fontSize: 'medium'
  });

  const handleSettingChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleLanguageChange = (e) => {
    setSettings({
      ...settings,
      language: e.target.value
    });
  };

  const applySettings = () => {
    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    
    // Apply font family
    const fontClass = `font-${settings.fontFamily}`;
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    if (settings.fontFamily !== 'system') {
      document.body.classList.add(fontClass);
    }
    
    // Apply font size
    const sizeClass = `font-${settings.fontSize}`;
    document.body.className = document.body.className.replace(/font-(small|medium|large|xlarge)/g, '');
    document.body.classList.add(sizeClass);
    
    // Apply background theme
    const bgClass = `bg-${settings.backgroundTheme}`;
    document.body.className = document.body.className.replace(/bg-\w+/g, '');
    if (settings.backgroundTheme !== 'default') {
      document.body.classList.add(bgClass);
    }
  };

  // Apply settings whenever they change
  React.useEffect(() => {
    applySettings();
  }, [settings.accentColor, settings.fontFamily, settings.fontSize, settings.backgroundTheme]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  return (
    <div className="page-container">
      <div className="settings-container">
          <h1>Settings</h1>
          
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Switch between light and dark themes</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`toggle-btn ${isDark ? 'active' : ''}`}
              >
                {isDark ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Language</h3>
                <p>Choose your preferred language</p>
              </div>
              <select 
                value={settings.language} 
                onChange={handleLanguageChange}
                className="setting-select"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h2>Notifications</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications via email</p>
              </div>
              <button 
                onClick={() => handleSettingChange('emailNotifications')}
                className={`toggle-btn ${settings.emailNotifications ? 'active' : ''}`}
              >
                {settings.emailNotifications ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Receive push notifications in browser</p>
              </div>
              <button 
                onClick={() => handleSettingChange('pushNotifications')}
                className={`toggle-btn ${settings.pushNotifications ? 'active' : ''}`}
              >
                {settings.pushNotifications ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Weekly Digest</h3>
                <p>Get a weekly summary of popular posts</p>
              </div>
              <button 
                onClick={() => handleSettingChange('weeklyDigest')}
                className={`toggle-btn ${settings.weeklyDigest ? 'active' : ''}`}
              >
                {settings.weeklyDigest ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2>Privacy</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Public Profile</h3>
                <p>Make your profile visible to other users</p>
              </div>
              <button 
                onClick={() => handleSettingChange('publicProfile')}
                className={`toggle-btn ${settings.publicProfile ? 'active' : ''}`}
              >
                {settings.publicProfile ? 'On' : 'Off'}
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Show Email</h3>
                <p>Display your email on your public profile</p>
              </div>
              <button 
                onClick={() => handleSettingChange('showEmail')}
                className={`toggle-btn ${settings.showEmail ? 'active' : ''}`}
              >
                {settings.showEmail ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2>Personalization</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Accent Color</h3>
                <p>Choose your preferred accent color</p>
              </div>
              <div className="color-picker-container">
                <input 
                  type="color" 
                  value={settings.accentColor} 
                  onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                  className="color-picker"
                />
                <div className="color-presets">
                  {['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#17a2b8'].map(color => (
                    <button 
                      key={color}
                      className={`color-preset ${settings.accentColor === color ? 'active' : ''}`}
                      style={{backgroundColor: color}}
                      onClick={() => setSettings({...settings, accentColor: color})}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Font Family</h3>
                <p>Select your preferred font</p>
              </div>
              <select 
                value={settings.fontFamily} 
                onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                className="setting-select"
              >
                <option value="system">System Default</option>
                <option value="inter">Inter</option>
                <option value="roboto">Roboto</option>
                <option value="opensans">Open Sans</option>
                <option value="lato">Lato</option>
                <option value="montserrat">Montserrat</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Font Size</h3>
                <p>Adjust text size for better readability</p>
              </div>
              <select 
                value={settings.fontSize} 
                onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                className="setting-select"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h3>Background Theme</h3>
                <p>Choose your background style</p>
              </div>
              <select 
                value={settings.backgroundTheme} 
                onChange={(e) => setSettings({...settings, backgroundTheme: e.target.value})}
                className="setting-select"
              >
                <option value="default">Default</option>
                <option value="gradient">Gradient</option>
                <option value="pattern">Pattern</option>
                <option value="minimal">Minimal</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
              </select>
            </div>
          </div>

          <div className="settings-section danger-zone">
            <h2>Account</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Sign Out</h3>
                <p>Sign out of your account</p>
              </div>
              <button onClick={handleLogout} className="btn-danger">
                Sign Out
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Settings;