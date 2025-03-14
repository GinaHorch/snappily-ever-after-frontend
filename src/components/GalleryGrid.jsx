import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { galleryService } from '../services/gallery';
import { authService } from '../services/auth';
import PhotoUpload from './PhotoUpload';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  
  &:hover {
    .overlay {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 62, 80, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px;
  class: overlay;
`;

const DownloadButton = styled.button`
  background: white;
  color: #2c3e50;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-size: 0.9em;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const MessageContent = styled.div`
  padding: 10px 0;
`;

const GuestName = styled.h3`
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  margin: 0;
  font-size: 1.1em;
`;

const Message = styled.p`
  font-family: 'Lato', sans-serif;
  color: #34495e;
  margin: 8px 0;
  font-size: 0.9em;
  line-height: 1.4;
`;

const Timestamp = styled.span`
  font-size: 0.8em;
  color: #95a5a6;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
`;

const GalleryGrid = ({ refreshTrigger }) => {
  console.log("GalleryGrid received refreshTrigger:", refreshTrigger); // ✅ Debugging step
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    console.log("useEffect triggered on mount"); // ✅ Debugging
    fetchSubmissions();
  }, []); // ✅ Runs on mount
  
  useEffect(() => {
    if (refreshTrigger) {
      console.log("Refresh Trigger Activated! Fetching submissions again..."); // ✅ Debugging
      fetchSubmissions();
    }
  }, [refreshTrigger]); // ✅ Runs when a new image is uploaded

  const fetchSubmissions = async () => {
    console.log("fetchSubmissions() called");  // ✅ Check if function runs
    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      console.log("Fetched data from API:", data); // ✅ Check API response
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      console.error('Error fetching submissions:', err);
      setError("Failed to load Images. Please try again later.")
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadSuccess = (newImage) => {
    console.log("New image received:", newImage); // ✅ Debugging step
    setSubmissions((prevSubmissions) => [...prevSubmissions, newImage]);
  };
  

  const handleDelete = async (imageId) => {
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryService.deleteImage(imageId);
        // Refresh the gallery
        fetchSubmissions();
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const handleDownload = async (imageUrl, name) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Create filename from name and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${name.replace(/\s+/g, '_')}_${timestamp}.jpg`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Sorry, there was an error downloading the image. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
   <Grid>
      {submissions.map((submission) => (
        <Card key={submission.id}>
          {isAdmin && (
            <DeleteButton onClick={() => handleDelete(submission.id)}>
              Delete
            </DeleteButton>
          )}
          {submission.image && (
            <ImageContainer>
              <Image 
                src={submission.image} 
                alt={`Photo by ${submission.name}`} 
              />
              <ImageOverlay className="overlay">
                <DownloadButton
                  onClick={() => handleDownload(submission.image, submission.name)}
                >
                  Download Photo
                </DownloadButton>
              </ImageOverlay>
            </ImageContainer>
          )}
          <MessageContent>
            <GuestName>{submission.name}</GuestName>
            {submission.comment && (
              <Message>{submission.comment}</Message>
            )}
            <Timestamp>
              {new Date(submission.uploaded_at).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Timestamp>
          </MessageContent>
        </Card>
      ))}
    </Grid>
  );
};

export default GalleryGrid; 