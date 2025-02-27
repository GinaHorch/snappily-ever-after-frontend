import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Book from './components/Book'
import AdminDashboard from './components/AdminDashboard'
import styled from 'styled-components'
import { authService } from './services/auth'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminLink = styled(Link)`
  padding: 8px 16px;
  background-color: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
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

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAdmin = authService.isAdmin();
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const isAdmin = authService.isAdmin();

  return (
    <Router>
      <AppContainer>
        {isAdmin && (
          <AdminLinkContainer>
            <AdminLink to="/admin">Admin Dashboard</AdminLink>
          </AdminLinkContainer>
        )}
        <Routes>
          <Route path="/" element={<Book />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
