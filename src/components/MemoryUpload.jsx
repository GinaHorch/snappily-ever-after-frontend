import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { galleryService } from '../services/gallery';
import LoginForm from './LoginForm';
import { authService } from '../services/auth';
import Confetti from 'react-confetti';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #e6e6fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(157, 175, 137, 0.95);
  border-radius: 12px;
  padding: 30px;
  margin-top: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const HeaderIcon = styled.img`
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  display: block;
  filter: brightness(0) invert(1);
  opacity: 0.95;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h1`
  color: white;
  font-family: "Parisienne";
  font-size: 45px;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #2e6f40;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
`;

const WeddingImage = styled.img`
  width: 100%;
  max-width: 80%;
  height: 300px;
  object-fit: contain;
  margin: 20px auto;
  display: block;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Parisienne", sans-serif;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Parisienne", sans-serif;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const DropZone = styled.div`
  border: 2px solid #2e6f40;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  font-family: "Parisienne", sans-serif;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(46, 111, 64, 0);
    transition: all 0.3s ease;
    pointer-events: none;
    border-radius: 6px;
  }

  &:hover::before {
    background: rgba(46, 111, 64, 0.05);
  }
  
  ${props => props.$isDragActive && `
    border-style: dashed;
    border-color: #34495e;
    
    &::before {
      background: rgba(46, 111, 64, 0.1);
    }
  `}

  p {
    color: #2c3e50;
    margin: 0;
    position: relative;
    z-index: 1;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  margin-top: 20px;
  border-radius: 8px;
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
    background-color: #1e4a2a;
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

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;

  img {
    width: 30px;
    height: 30px;
  }

  p {
    color: #2e6f40;
    font-size: 16px;
    margin: 0;
    font-family: "Parisienne", sans-serif;
  }
`;

const ViewBookButton = styled(Button)`
  background-color: #2E6F40;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 15px;

  &:hover {
    background-color: #1e4a2a;
  }
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: "Parisienne", sans-serif;

  strong {
    color: #2e6f40;
    display: block;
    margin-bottom: 10px;
    font-size: 16px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 8px;
    color: #2c3e50;
    font-size: 14px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: #2e6f40;
      display: inline;
      font-size: 14px;
    }
  }
`;

const AdminIndicator = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #2e6f40;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: "Lato", sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
    top: 15px;
    right: 15px;
  }

  &:hover {
    background-color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: "🚪";
    font-size: 16px;
  }
`;

const MemoryUpload = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add effect to check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthed = authService.isAuthenticated();
      const isAdminUser = authService.isAdmin();
      setIsAuthenticated(isAuthed);
      setIsAdmin(isAdminUser);
    };
    
    checkAuth();
    // Set up an interval to check auth status periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError("Please select only one photo at a time. You can add more memories by submitting them separately.");
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB in bytes
    multiple: false,
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0]?.errors[0]?.code === 'file-too-large') {
        setError("File size is too large. Please upload an image smaller than 5MB.");
      } else if (rejectedFiles[0]?.errors[0]?.code === 'file-invalid-type') {
        setError("Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.");
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await galleryService.uploadImage({
        imageFile: image || null,
        comment: message.trim() || "",
        name: guestName.trim(),
      });

      console.log("Upload successful:", response);
      setSuccessMessage("success");
      
      // Reset form
      setGuestName("");
      setMessage("");
      setImage(null);
      setPreview(null);
      
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload memory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      await onLogin();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <PageContainer>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        numberOfPieces={50}
        confettiSource={{ x: 0, y: 0, w: windowDimensions.width, h: 0 }}
        initialVelocityY={3}
        gravity={0.1}
        wind={0.01}
        colors={['#9daf89', '#2e6f40', '#ffffff', '#e6e6fa', '#ffd700']}
        recycle={true}
        run={true}
        tweenDuration={5000}
        opacity={0.6}
      />
      <ContentContainer>
        {isAuthenticated && isAdmin && (
          <AdminIndicator>
            👑 Admin Mode
          </AdminIndicator>
        )}
        {isAuthenticated && !isAdmin && (
          <LogoutButton onClick={() => {
            authService.logout();
            window.location.reload();
          }}>
            Logout
          </LogoutButton>
        )}
        <HeaderIcon 
          src="/images/cameraheart-icon.svg" 
          alt="Camera heart icon" 
          onError={(e) => {
            console.error('Failed to load camera heart icon');
            e.target.style.display = 'none';
          }}
        />
        <Title>Katie & Alex's Wedding Guest Book</Title>
        <Subtitle>Share Your Memory to Fill the Book</Subtitle>
        <WeddingImage src="/images/cat_wedding.png" alt="Wedding cats" />
        
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <Instructions>
              <strong>How to share your memory:</strong>
              <ul>
                <li><strong>Your Name</strong> is required - this helps Katie and Alex know who left the memory</li>
                <li><strong>Message</strong> is optional - feel free to share your thoughts or leave it blank</li>
                <li><strong>Photo</strong> is optional - you can add one photo per memory. Want to share more photos? You can submit multiple memories!</li>
              </ul>
            </Instructions>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Your Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />

              <TextArea
                placeholder="Share your memory (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <DropZone {...getRootProps()} $isDragActive={isDragActive}>
                <input {...getInputProps()} />
                {preview ? (
                  <PreviewImage src={preview} alt="Preview" />
                ) : (
                  <p>Click to add a photo - max size 5MB</p>
                )}
              </DropZone>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sharing..." : "Share Memory"}
              </Button>

              <ViewBookButton type="button" onClick={() => navigate('/book')}>
                <img 
                  src="/images/guestbook-icon.svg" 
                  alt="Guestbook" 
                  style={{ width: '20px', height: '20px' }}
                />
                <span>View Guest Book</span>
              </ViewBookButton>

              {successMessage && (
                <SuccessMessage>
                  <img src="/images/thankful-icon.svg" alt="Thank you" />
                  <p>Thank you for sharing your special memory!</p>
                </SuccessMessage>
              )}
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MemoryUpload; 