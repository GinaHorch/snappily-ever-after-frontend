import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { galleryService } from "../services/gallery";

const UploadContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 15px;
    max-width: calc(100% - 30px); // Account for padding on both sides
    
    &::after {
      content: '';
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232e6f40'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E") no-repeat center;
      animation: bounce 2s infinite;
      pointer-events: none;
      opacity: 0.7;
      z-index: 10;
    }
  }

  @media (max-width: 450px) {
    padding: 12px;
    max-width: calc(100% - 24px);
  }

  @media (max-width: 360px) {
    padding: 10px;
    max-width: calc(100% - 20px);
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #2e6f40;
    font-size: 1.1em;
    margin-bottom: 10px;
    font-family: "Lato", sans-serif;
  }

  @media (max-width: 360px) {
    margin-bottom: 15px;
    
    h3 {
      font-size: 1em;
      margin-bottom: 8px;
    }
  }
`;

const DropZone = styled.div`
  border: 2px dashed #c2c2c2;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;
  background-color: rgba(46, 111, 64, 0.05);

  &:hover {
    border-color: #2e6f40;
    background-color: rgba(46, 111, 64, 0.1);
  }

  p {
    margin: 0;
    color: #2e6f40;
  }

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 360px) {
    padding: 12px;
    margin-bottom: 12px;
    
    p {
      font-size: 14px;
    }
  }
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Preview = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 10px;

  @media (max-width: 360px) {
    max-width: 150px;
    max-height: 150px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 768px) {
    scroll-behavior: smooth;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding-bottom: 60px;
    gap: 12px;
    
    // Enhance scrollbar visibility
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(46, 111, 64, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(46, 111, 64, 0.3);
      border-radius: 4px;
      
      &:hover {
        background: rgba(46, 111, 64, 0.5);
      }
    }
  }

  @media (max-width: 450px) {
    gap: 10px;
    padding-bottom: 55px;
  }

  @media (max-width: 360px) {
    padding-bottom: 50px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;

  &:focus {
    outline: none;
    border-color: #2e6f40;
  }

  @media (max-width: 360px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2e6f40;
  }

  @media (max-width: 360px) {
    padding: 10px;
    font-size: 14px;
    min-height: 80px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2e6f40;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #9daf89;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    position: sticky;
    bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 360px) {
    padding: 10px;
    font-size: 14px;
    bottom: 15px;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const Instructions = styled.div`
  background-color: rgba(46, 111, 64, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #2e6f40;
  line-height: 1.5;

  ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  @media (max-width: 360px) {
    padding: 12px;
    font-size: 13px;
  }
`;

const PhotoUpload = ({ setRefreshTrigger, onSuccess }) => {
  if (!setRefreshTrigger) {
    console.error("setRefreshTrigger is missing in PhotoUpload");
  }
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");  // ✅ Add success message state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError("Please select only one photo at a time");
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

    // Input validation - only require name
    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image & message
      const response = await galleryService.uploadImage({
        imageFile: image || null,
        comment: message,
        name: guestName,
    });

      console.log("Upload successful:", response); // ✅ Debugging step

      // ✅ Trigger GalleryGrid update if onSuccess exists
      if (onSuccess) {
        console.log("Triggering onSuccess callback...");
        onSuccess(response);
      }

      // ✅ Trigger refresh in GalleryGrid
      setRefreshTrigger((prev) => {
        console.log("Toggling refreshTrigger. Previous:", prev, "New:", !prev); // ✅ Step 6: Debug state update
        return !prev;
    });
    
      // ✅ Show success message
      setSuccessMessage("Your memory has been shared successfully! 🎉");
      // Reset form
      setGuestName("");
      setMessage("");
      setImage(null);
      setPreview(null);

      // Trigger refresh
      setRefreshTrigger(prev => !prev);
      
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

  return (
    <UploadContainer>
      <Instructions>
        <strong>How to share your memory:</strong>
        <ul>
          <li><strong>Your Name</strong> is required - this helps Katie and Alex know who left the memory</li>
          <li><strong>Message</strong> is optional - feel free to share your thoughts or leave it blank</li>
          <li><strong>Photo</strong> is optional - you can add a photo to your memory, or just share your message</li>
        </ul>
      </Instructions>
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <Input
            type="text"
            placeholder="Your Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </FormSection>

        <FormSection>
          <TextArea
            placeholder="Share your memory (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormSection>

        <FormSection>
          <DropZone {...getRootProps()}>
            <input {...getInputProps()} />
            <p>
              {isDragActive
                ? "Drop your photo here"
                : "Drag & drop a photo here, or click to select"}
            </p>
          </DropZone>
          {preview && (
            <PreviewContainer>
              <Preview src={preview} alt="Preview" />
            </PreviewContainer>
          )}
        </FormSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sharing..." : "Share Your Memory"}
        </Button>
      </Form>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </UploadContainer>
  );
};

export default PhotoUpload;
