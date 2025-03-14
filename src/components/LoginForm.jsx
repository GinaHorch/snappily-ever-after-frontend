import { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../services/auth';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 300px;
  margin-top: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2E6F40;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const AdminButton = styled.button`
  background: none;
  border: none;
  color: #2e6f40;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  padding: 5px;

  &:hover {
    color: #34495e;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

const LoginForm = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdminMode) {
        // Admin login with username and password
        await authService.login(formData.username, formData.password);
      } else {
        // Guest login with just the password
        await authService.login(null, formData.password);
      }
      onLogin();
      setError('');
    } catch (error) {
      setError(isAdminMode ? 'Invalid admin credentials.' : 'Incorrect passcode. Please try again.');
    }
  };

  const toggleAdminMode = (e) => {
    e.preventDefault();
    setIsAdminMode(!isAdminMode);
    setFormData({ username: '', password: '' });
    setError('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {isAdminMode && (
        <Input
          type="text"
          placeholder="Admin Username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
      )}
      <Input
        type="password"
        placeholder={isAdminMode ? "Admin Password" : "Enter event password"}
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      <Button type="submit">{isAdminMode ? 'Admin Login' : 'Enter Guestbook'}</Button>
      <AdminButton onClick={toggleAdminMode}>
        {isAdminMode ? '← Back to Guest Login' : 'Admin Login →'}
      </AdminButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default LoginForm; 