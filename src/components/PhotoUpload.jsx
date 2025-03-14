import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { galleryService } from "../services/gallery";

const UploadContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const DropZone = styled.div`
  border: 2px dashed #c2c2c2;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: #2c3e50;
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
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
    border-color: #2c3e50;
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
    border-color: #2c3e50;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2e6f40; /* Updated color */
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
  margin-top: 5px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
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
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!message.trim() && !image) {
      setError("Please add either a message or a photo");
      return;
    }

    setIsSubmitting(true);
    setError("");

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
      setPreview("");

      // ✅ Hide success message after a few seconds
      setTimeout(() => setSuccessMessage(""), 4000);

    } catch (err) {
        console.error("Upload error:", err); // Debugging step
        setError(err.error || "Failed to upload. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <UploadContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <TextArea
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />

        <DropZone
          {...getRootProps()}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <input {...getInputProps()} disabled={isSubmitting} />
          {isDragActive ? (
            <p>Drop your photo here...</p>
          ) : (
            <p>Drag & drop a photo here, or click to select one</p>
          )}
        </DropZone>

        {preview && (
          <PreviewContainer>
            <Preview src={preview} alt="Preview" />
          </PreviewContainer>
        )}

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
