import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
  const { currentUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="landing">
      <div className="landing-header">
        <div className="nav-logo">BlogHub</div>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDark ? '☀' : '☽'}
        </button>
      </div>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-up">
            Your Hub for <span className="highlight">Stories & Ideas</span>
          </h1>
          <p className="hero-subtitle animate-fade-up-delay">
            Join thousands of writers and readers in a vibrant community where creativity meets inspiration. Share your unique perspective, discover compelling narratives, and connect with like-minded storytellers from around the globe.
          </p>
          <Link to={currentUser ? "/home" : "/signup"} className="btn-hero animate-bounce">
            {currentUser ? "Go to Dashboard" : "Start Writing Today"}
          </Link>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1 animate-float"></div>
          <div className="shape shape-2 animate-float-reverse"></div>
          <div className="shape shape-3 animate-float"></div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2 className="features-title animate-slide-up">Why Choose BlogHub?</h2>
          <p className="features-description animate-slide-up-delay">
            Experience the perfect blend of creativity and community in our modern blogging platform designed for the next generation of storytellers.
          </p>
          <div className="features-grid">
            <div className="feature-card animate-card-1">
              <div className="feature-icon">✎</div>
              <h3>Write Freely</h3>
              <p>Express yourself with our intuitive editor. Rich formatting, auto-save, and distraction-free writing environment help you focus on what matters most - your story.</p>
              <ul className="feature-list">
                <li>Rich text editor with markdown support</li>
                <li>Auto-save and draft management</li>
                <li>SEO optimization tools</li>
              </ul>
            </div>
            <div className="feature-card animate-card-2">
              <div className="feature-icon">▦</div>
              <h3>Read & Explore</h3>
              <p>Discover captivating content from writers worldwide. Our smart recommendation engine helps you find stories that match your interests and expand your horizons.</p>
              <ul className="feature-list">
                <li>Personalized content recommendations</li>
                <li>Advanced search and filtering</li>
                <li>Bookmark and reading lists</li>
              </ul>
            </div>
            <div className="feature-card animate-card-3">
              <div className="feature-icon">↔</div>
              <h3>Connect & Grow</h3>
              <p>Build meaningful relationships with fellow writers and readers. Comment, collaborate, and grow your audience in our supportive community environment.</p>
              <ul className="feature-list">
                <li>Interactive comments and discussions</li>
                <li>Writer collaboration tools</li>
                <li>Analytics and audience insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container animate-fade-in">
          <h2>Ready to Share Your Story?</h2>
          <p>Join our community of passionate writers and readers. Your voice matters, and your story deserves to be heard.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary btn-large">Create Free Account</Link>
            <Link to="/home" className="btn-secondary btn-large">Explore Stories</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;