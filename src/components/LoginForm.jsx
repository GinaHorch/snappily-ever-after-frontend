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

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

const LoginForm = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Temporary mock authentication
    try {
      // Use "PreWedding" as the username for guests
      await authService.login("PreWedding", passcode);
      onLogin();
      setError('');
    } catch (error) {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="password"
        placeholder="Enter event password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        required
      />
      <Button type="submit">Enter Guestbook</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default LoginForm; 