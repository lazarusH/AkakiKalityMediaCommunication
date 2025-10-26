import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import NewsList from './pages/NewsList';
import ArticleDetail from './pages/ArticleDetail';
import Gallery from './pages/Gallery';
import Files from './pages/Files';
import About from './pages/About';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import ArticleList from './pages/admin/ArticleList';
import ArticleForm from './pages/admin/ArticleForm';
import GalleryManager from './pages/admin/GalleryManager';
import FileManager from './pages/admin/FileManager';
import InstitutionManager from './pages/admin/InstitutionManager';
import SocialMediaManager from './pages/admin/SocialMediaManager';

// Institution Pages - Dynamic Route
import DynamicInstitution from './pages/institutions/DynamicInstitution';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/news/:category" element={<NewsList />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/files" element={<Files />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />

              {/* Dynamic Institution Route - Handles ALL institutions by slug */}
              <Route path="/institutions/:slug" element={<DynamicInstitution />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminHome />} />
                <Route path="articles" element={<ArticleList />} />
                <Route path="articles/new" element={<ArticleForm />} />
                <Route path="articles/edit/:id" element={<ArticleForm />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="gallery/upload" element={<GalleryManager />} />
                <Route path="files" element={<FileManager />} />
                <Route path="files/upload" element={<FileManager />} />
                <Route path="institutions" element={<InstitutionManager />} />
                <Route path="social-media" element={<SocialMediaManager />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
