import styled from 'styled-components';

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

const GalleryGrid = ({ submissions }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (image, guestName) => {
    try {
      let url;
      if (typeof image === 'string') {
        // If image is an S3 URL (when backend is connected)
        url = image;
      } else {
        // For local File objects (current implementation)
        url = URL.createObjectURL(image);
      }

      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Create filename from guest name and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${guestName.replace(/\s+/g, '_')}_${timestamp}.jpg`;
      
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

  return (
    <Grid>
      {submissions.map((submission, index) => (
        <Card key={index}>
          {submission.image && (
            <ImageContainer>
              <Image 
                src={URL.createObjectURL(submission.image)} 
                alt={`Photo by ${submission.guestName}`} 
              />
              <ImageOverlay className="overlay">
                <DownloadButton
                  onClick={() => handleDownload(submission.image, submission.guestName)}
                >
                  Download Photo
                </DownloadButton>
              </ImageOverlay>
            </ImageContainer>
          )}
          <MessageContent>
            <GuestName>{submission.guestName}</GuestName>
            {submission.message && (
              <Message>{submission.message}</Message>
            )}
            <Timestamp>{formatDate(submission.timestamp)}</Timestamp>
          </MessageContent>
        </Card>
      ))}
    </Grid>
  );
};

export default GalleryGrid; 