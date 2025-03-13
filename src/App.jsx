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
  background: #e6e6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative; 
  z-index: 1; 
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
    background-color: #34495e;
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
  const isAdmin = authService.isAdmin();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());

  useEffect(() => {
    // Update admin state when authentication changes
    setIsAuthenticated(authService.isAuthenticated());
    setIsAdmin(authService.isAdmin());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAdmin(authService.isAdmin());
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  return (
    <Router>
      <AppContainer>
        {/* Confetti placed here with low z-index */}
        <Confetti
          width={windowWidth}
          height={windowHeight}
          numberOfPieces={250}
          recycle={true}
          gravity={0.1}
          initialVelocityY={3}
          initialVelocityX={5}
          colors={["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0, // Lower z-index to put it behind content
          }}
        />

        {/* Content is rendered above the confetti */}
        {isAdmin && (
          <AdminLinkContainer>
            <AdminLink to="/admin">Admin Dashboard</AdminLink>
          </AdminLinkContainer>
        )}

        <Routes>
          {/* If authenticated, show guestbook, else show login */}
          <Route path="/" element={isAuthenticated ? <Book /> : <LoginForm onLogin={handleLogin} />} />
          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Add the floral pattern section at the bottom */}
        <FloralPatternSection />
      </AppContainer>
    </Router>
  );
}

export default App;
