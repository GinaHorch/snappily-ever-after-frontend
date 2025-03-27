import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import Book from "./components/Book";
import AdminDashboard from "./components/AdminDashboard";
import LoginForm from "./components/LoginForm";
import MemoryUpload from "./components/MemoryUpload";
import AdminError from "./components/AdminError";
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

const AdminLinkContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

const AdminLink = styled(Link)`
  padding: 8px 16px;
  background-color: #2e6f40;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }

  &:hover {
    background-color: #1e4a2a;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: "👑";
    font-size: 16px;
  }
`;

const FloralPatternSection = styled.div`
  width: 100%;
  height: 200px;
  background: url("/images/floral-pattern.jpg") no-repeat center center;
  background-size: cover;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #9daf89;
  border-top: 5px solid #2e6f40;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const isAdmin = authService.isAdmin();
      setIsAuthorized(isAuthenticated && isAdmin);
      setIsChecking(false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
      </LoadingOverlay>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ requiresAuth: true }} replace />;
  }

  return children;
};

// Separate component for the app content that uses useLocation
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    const admin = authService.isAdmin();
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
  };

  useEffect(() => {
    checkAuth();
    // Check auth status more frequently
    const interval = setInterval(checkAuth, 1000);
    window.addEventListener('storage', checkAuth);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = () => {
    authService.logout();
    checkAuth();
    navigate('/'); // Navigate to home page which shows the login form
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <AppContainer>
      {location.pathname === '/' && (
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
            canvas: {
              maxWidth: "100dvw",
              overflowX: "hidden"
            }
          }}
        />
      )}

      {isAuthenticated && isAdmin && location.pathname !== '/admin' && (
        <AdminLinkContainer>
          <AdminLink to="/admin">Admin Dashboard</AdminLink>
        </AdminLinkContainer>
      )}

      <Routes>
        <Route path="/" element={<MemoryUpload onLogin={handleLogin} />} />
        <Route path="/book" element={<Book onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminError />
            )
          }
        />
      </Routes>
    </AppContainer>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
