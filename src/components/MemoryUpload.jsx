import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { galleryService } from '../services/gallery';
import LoginForm from './LoginForm';
import { authService } from '../services/auth';

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
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(157, 175, 137, 0.95);
  border-radius: 12px;
  padding: 30px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  font-family: "Lato", sans-serif;
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
  font-family: "Lato", sans-serif;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragActive ? '#2e6f40' : '#95a5a6'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isDragActive ? 'rgba(46, 111, 64, 0.1)' : 'transparent'};

  &:hover {
    border-color: #2e6f40;
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

const SuccessMessage = styled.p`
  color: #2e6f40;
  font-size: 14px;
  margin-top: 10px;
`;

const ViewBookButton = styled(Button)`
  background-color: #9daf89;
  margin-top: 20px;

  &:hover {
    background-color: #8a9b7a;
  }
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: "Lato", sans-serif;

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

const MemoryUpload = ({ onLogin, onSuccess }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await galleryService.uploadImage({
        imageFile: image || null,
        comment: message,
        name: guestName,
      });

      console.log("Upload successful:", response);
      setSuccessMessage("Your memory has been shared successfully! 🎉");
      
      // Reset form
      setGuestName("");
      setMessage("");
      setImage(null);
      setPreview(null);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
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
      <ContentContainer>
        <Title>Katie & Alex</Title>
        <Subtitle>Share Your Memory</Subtitle>
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
              
              <DropZone {...getRootProps()} $isDragActive={isDragActive}>
                <input {...getInputProps()} />
                {preview ? (
                  <PreviewImage src={preview} alt="Preview" />
                ) : (
                  <p>Drag & drop your photo here, or click to select one photo at a time</p>
                )}
              </DropZone>

              <TextArea
                placeholder="Share your memory (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sharing..." : "Share Memory"}
              </Button>

              <ViewBookButton type="button" onClick={() => navigate('/book')}>
                View Guest Book
              </ViewBookButton>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            </Form>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MemoryUpload; 