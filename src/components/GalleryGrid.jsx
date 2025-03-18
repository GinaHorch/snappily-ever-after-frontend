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

// const MessageContent = styled.div`
//   padding: 10px 0;
// `;

const GuestName = styled.h3`
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  margin: 0;
  font-size: 1.1em;
`;

// const Message = styled.p`
//   font-family: 'Lato', sans-serif;
//   color: #34495e;
//   margin: 8px 0;
//   font-size: 0.9em;
//   line-height: 1.4;
// `;

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
  console.log("GalleryGrid received refreshTrigger:", refreshTrigger);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = authService.isAdmin();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("useEffect triggered on mount");
      fetchSubmissions();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (refreshTrigger && isAuthenticated) {
      console.log("Refresh Trigger Activated! Fetching submissions again...");
      fetchSubmissions();
    }
  }, [refreshTrigger, isAuthenticated]);

  const fetchSubmissions = async () => {
    if (!isAuthenticated) {
      return;
    }

    console.log("fetchSubmissions() called");
    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      console.log("Fetched data from API:", data);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError("Failed to load images. Please try again later.");
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

  const handleDownload = async (image) => {
    try {
      console.log('Download requested for image:', {
        fullObject: image,
        id: image.id,
        imageUrl: image.image,
        name: image.name
      });
      
      if (!image.id) {
        console.error('No image ID provided:', image);
        throw new Error('Image ID is missing');
      }

      const blob = await galleryService.downloadImage(image.image, image.id);
      // No need to create another blob and link since the service handles it
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
              {isAdmin && (
                <ImageOverlay className="overlay">
                  <DownloadButton
                    onClick={() => handleDownload(submission)}
                  >
                    Download Photo
                  </DownloadButton>
                </ImageOverlay>
              )}
            </ImageContainer>
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
        </Card>
      ))}
    </Grid>
  );
};

export default GalleryGrid; 