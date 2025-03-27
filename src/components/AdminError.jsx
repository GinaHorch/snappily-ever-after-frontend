import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background: #e6e6fa;
`;

const ErrorTitle = styled.h1`
  color: #2e6f40;
  font-family: "Playfair Display", serif;
  font-size: 2.5em;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 1.2em;
  margin-bottom: 30px;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Lato", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1em;
    padding: 0 20px;
  }
`;

const HomeButton = styled(Link)`
  padding: 12px 24px;
  background-color: #2e6f40;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  transition: all 0.3s ease;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #1e4a2a;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const AdminError = () => {
  return (
    <ErrorContainer>
      <ErrorTitle>Oops! Access Denied</ErrorTitle>
      <ErrorMessage>
        It looks like you're trying to access the admin dashboard without proper authentication. 
        Please make sure you're logged in as an administrator to access this page.
      </ErrorMessage>
      <HomeButton to="/">
        Return to Guestbook
      </HomeButton>
    </ErrorContainer>
  );
};

export default AdminError; 