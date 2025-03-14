import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Book from "./components/Book";
import AdminDashboard from "./components/AdminDashboard";
import LoginForm from "./components/LoginForm";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { authService } from "./services/auth";
import Confetti from "react-confetti";

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #e6e6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: 20px;
`;

const AdminLink = styled(Link)`
  padding: 8px 16px;
  background-color: #2e6f40;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #9daf89;
  }
`;

const AdminLinkContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const FloralPatternSection = styled.div`
  width: 100%;
  height: 200px;
  background: url("/images/floral-pattern.jpg") no-repeat center center;
  background-size: cover;
`;

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ requiresAuth: true }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    const admin = authService.isAdmin();
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
  };

  useEffect(() => {
    checkAuth();
    // Listen for storage changes (in case of logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => {
    checkAuth(); // Update auth state immediately after login
  };

  const handleLogout = () => {
    authService.logout();
    checkAuth(); // Update auth state immediately after logout
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <Router>
      <AppContainer>
        {/* Only show confetti on the main page */}
        {window.location.pathname === '/' && (
          <Confetti
            width={windowWidth}
            height={windowHeight}
            numberOfPieces={100}
            recycle={true}
            gravity={0.2}
            initialVelocityY={2}
            initialVelocityX={2}
            colors={["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"]}
            opacity={0.7}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
        )}

        {/* Show admin link only when logged in as admin */}
        {isAuthenticated && isAdmin && (
          <AdminLinkContainer>
            <AdminLink to="/admin">Admin Dashboard</AdminLink>
          </AdminLinkContainer>
        )}

        <Routes>
          {/* Main route - always show Book component which handles its own auth state */}
          <Route path="/" element={<Book onLogin={handleLogin} />} />
          
          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
