import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchProvider } from './contexts/SearchContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NewPost from './components/NewPost';
import ViewPost from './components/ViewPost';
import EditPost from './components/EditPost';
import Login from './components/Login';
import Signup from './components/Signup';
import Popular from './components/Popular';
import Categories from './components/Categories';
import MyBlogs from './components/MyBlogs';
import LikedPosts from './components/LikedPosts';
import MyComments from './components/MyComments';
import MyProfile from './components/MyProfile';
import Settings from './components/Settings';
import CreateCommunity from './components/CreateCommunity';
import MyCommunity from './components/MyCommunity';
import CommunityPage from './components/CommunityPage';
import CategoryPage from './components/CategoryPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <SearchProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Home />
                </main>
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/new" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <NewPost />
                </main>
              </PrivateRoute>
            } />
            <Route path="/post/:id" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <ViewPost />
                </main>
              </PrivateRoute>
            } />
            <Route path="/edit/:id" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <EditPost />
                </main>
              </PrivateRoute>
            } />
            <Route path="/popular" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Popular />
                </main>
              </PrivateRoute>
            } />
            <Route path="/categories" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Categories />
                </main>
              </PrivateRoute>
            } />
            <Route path="/my-blogs" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <MyBlogs />
                </main>
              </PrivateRoute>
            } />
            <Route path="/liked-posts" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <LikedPosts />
                </main>
              </PrivateRoute>
            } />
            <Route path="/my-comments" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <MyComments />
                </main>
              </PrivateRoute>
            } />
            <Route path="/my-profile" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <MyProfile />
                </main>
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Settings />
                </main>
              </PrivateRoute>
            } />
            <Route path="/create-community" element={
              <PrivateRoute>
                <Navbar />
                <CreateCommunity />
              </PrivateRoute>
            } />
            <Route path="/my-community" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <MyCommunity />
                </main>
              </PrivateRoute>
            } />
            <Route path="/community/:id" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <CommunityPage />
                </main>
              </PrivateRoute>
            } />
            <Route path="/category/:categoryName" element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <CategoryPage />
                </main>
              </PrivateRoute>
            } />
          </Routes>
        </div>
            </SearchProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
