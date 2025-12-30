import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CareerDetailPage from './pages/CareerDetailPage';
import TrackApplicationPage from './pages/TrackApplicationPage';

// Admin Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import ContactsPage from './pages/admin/ContactsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import ServicesPage from './pages/admin/ServicesPage';
import TeamPage from './pages/admin/TeamPage';
import ClientsPage from './pages/admin/ClientsPage';
import CareersPage from './pages/admin/CareersPage';
import ApplicationsPage from './pages/admin/ApplicationsPage';
import BlogsPage from './pages/admin/BlogsPage';
import SettingsPage from './pages/admin/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/careers/:id" element={<CareerDetailPage />} />
          <Route path="/track-application" element={<TrackApplicationPage />} />

          {/* Auth Routes */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <BlogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/team"
            element={
              <ProtectedRoute>
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/careers"
            element={
              <ProtectedRoute>
                <CareersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute>
                <TestimonialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute>
                <ContactsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
