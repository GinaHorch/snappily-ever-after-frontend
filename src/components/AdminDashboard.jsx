import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/auth';
import { galleryService } from '../services/gallery';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.$active ? '#2c3e50' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border: 2px solid #2c3e50;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#34495e' : '#eee'};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Lato', sans-serif;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-top: 10px;
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;

  h3 {
    margin: 0;
    color: #7f8c8d;
    font-size: 0.9em;
    text-transform: uppercase;
  }

  p {
    margin: 10px 0 0;
    font-size: 2em;
    color: #2c3e50;
    font-weight: bold;
  }
`;

const BackLink = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
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
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2c3e50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalImages: 0,
    totalMessages: 0,
    activeGroups: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Guest credentials form
  const [guestForm, setGuestForm] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const images = await galleryService.getAllImages();
      const groups = await galleryService.getAllGroups();
      
      setStats({
        totalImages: images.length,
        totalMessages: images.filter(img => img.message).length,
        activeGroups: groups.filter(group => group.is_active).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.changeAdminPassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      setSuccess('Password updated successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCredentialsUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      await authService.updateGuestCredentials(
        guestForm.username,
        guestForm.password
      );
      setSuccess('Guest credentials updated successfully');
      setGuestForm({ username: '', password: '' });
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err.error || 'Failed to update guest credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const data = await galleryService.exportData();
      
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wedding-guestbook-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully');
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <BackLink to="/">← Back to Guestbook</BackLink>
      
      <Header>
        <Title>Admin Dashboard</Title>
        <Button onClick={handleExportData} disabled={loading}>
          Export Data
        </Button>
      </Header>

      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      <TabContainer>
        <Tab 
          $active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          $active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Tab>
      </TabContainer>

      {activeTab === 'overview' && (
        <>
          <StatsGrid>
            <StatCard>
              <h3>Total Photos</h3>
              <p>{stats.totalImages}</p>
            </StatCard>
            <StatCard>
              <h3>Total Messages</h3>
              <p>{stats.totalMessages}</p>
            </StatCard>
            <StatCard>
              <h3>Active Groups</h3>
              <p>{stats.activeGroups}</p>
            </StatCard>
          </StatsGrid>
        </>
      )}

      {activeTab === 'settings' && (
        <>
          <Card>
            <h2>Update Admin Password</h2>
            <Form onSubmit={handlePasswordChange}>
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  oldPassword: e.target.value
                }))}
                required
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                required
              />
              <Button type="submit" disabled={loading}>
                Update Password
              </Button>
            </Form>
          </Card>

          <Card>
            <h2>Update Guest Access</h2>
            <Form onSubmit={handleGuestCredentialsUpdate}>
              <Input
                type="text"
                placeholder="Guest Username"
                value={guestForm.username}
                onChange={(e) => setGuestForm(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                required
              />
              <Input
                type="password"
                placeholder="Guest Password"
                value={guestForm.password}
                onChange={(e) => setGuestForm(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
              <Button type="submit" disabled={loading}>
                Update Guest Access
              </Button>
            </Form>
          </Card>
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </DashboardContainer>
  );
};

export default AdminDashboard; 