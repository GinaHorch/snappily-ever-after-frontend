import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { authService } from "../services/auth";
import { galleryService } from "../services/gallery";

// Styled components
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
`;

const TitleContainer = styled.div`
  flex-grow: 1;
  text-align: center;
  width: 100%;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  color: #2e6f40;
  margin: 60px auto 15px;
  text-align: center;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    margin-top: 70px;
    font-size: 28px;
  }

  @media (max-width: 480px) {
    margin-top: 60px;
    font-size: 24px;
  }

  @media (max-width: 350px) {
    margin-top: 50px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  button {
    width: 140px;
  }
`;

const HeartDivider = styled.img`
  display: block;
  margin: 20px auto;
  padding: 0;
  width: 80%;
  max-width: 400px;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    width: 95%;
    max-width: 250px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding: 0 10px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const Tab = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.$active ? "#2e6f40;" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#2e6f40;")};
  border: 2px solid #6666b3;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  transition: all 0.3s ease;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }

  &:hover {
    background-color: ${(props) => (props.$active ? "#9daf89" : "#eee")};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px #6666b3;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  margin: 40px auto 20px;

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px;
    margin: 30px auto 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
    margin: 20px auto 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 12px 20px 18px;

  @media (max-width: 768px) {
    padding: 10px 15px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 10px;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;
  width: 100%;

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: #2e6f40;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2e6f40;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  transition: background-color 0.3s ease;
  font-size: 14px;
  min-width: 140px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
  }

  &:hover {
    background-color: #9daf89;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #b3b3d9;
  margin-top: 10px;
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px auto;
  padding: 0 20px;
  max-width: 800px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 0 10px;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px #6666b3;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 10px;
  }

  h3 {
    margin: 0;
    color: #2e6f40;
    font-size: 0.9em;
    text-transform: uppercase;

    @media (max-width: 480px) {
      font-size: 0.8em;
    }
  }

  p {
    margin: 10px 0 0;
    font-size: 2em;
    color: #2e6f40;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 1.8em;
    }

    @media (max-width: 480px) {
      font-size: 1.6em;
    }
  }
`;

const BackLink = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #2e6f40;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  transition: background-color 0.3s ease;
  z-index: 1000;
  font-size: 14px;
  min-width: 160px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: 6px 12px;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 350px) {
    padding: 6px 10px;
    top: 10px;
    font-size: 13px;
    min-width: 140px;
  }

  &:hover {
    background-color: #9daf89;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #9daf89;
  border-top: 5px solid #2e6f40;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HeaderTitle = styled.h2`
  color: #2e6f40;
  text-align: center;
  margin: 20px 0;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 22px;
    margin: 15px 0;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin: 12px 0;
  }
`;

const FlipSymbol = styled.span`
  display: inline-block;
  transform: ${(props) => (props.flip ? "scaleX(-1)" : "none")};
  margin: 0 8px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 15px;
  }
`;

const MemoryCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const MemoryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
`;

const MemoryContent = styled.div`
  padding: 15px;
  flex-grow: 1;
`;

const MemoryName = styled.h3`
  color: #2e6f40;
  font-size: 18px;
  margin-bottom: 8px;
  font-family: "Playfair Display", serif;
`;

const MemoryMessage = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  font-family: "Lato", sans-serif;
  line-height: 1.4;
`;

const MemoryDate = styled.span`
  color: #999;
  font-size: 12px;
  font-family: "Lato", sans-serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  padding: 15px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-family: "Lato", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &.delete {
    background-color: #fee2e2;
    color: #dc2626;

    &:hover {
      background-color: #fecaca;
    }
  }

  &.download {
    background-color: #e0e7ff;
    color: #4f46e5;

    &:hover {
      background-color: #dbeafe;
    }
  }
`;

const NoMemories = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-family: "Lato", sans-serif;
  grid-column: 1 / -1;
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  font-family: "Lato", sans-serif;

  &:focus {
    outline: none;
    border-color: #1e4a2a;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid #2e6f40;
  border-radius: 20px;
  background: ${props => props.$active ? '#2e6f40' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#2e6f40'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Lato", sans-serif;

  &:hover {
    background: ${props => props.$active ? '#1e4a2a' : 'rgba(46, 111, 64, 0.1)'};
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalImages: 0,
    totalMessages: 0
  });
  const [memories, setMemories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, photos, messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newUsername: "",
  });

  // Guest credentials form
  const [guestForm, setGuestForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "gallery") {
      fetchMemories();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const images = await galleryService.getAllImages();
      
      setStats({
        totalImages: images.length,
        totalMessages: images.filter((img) => img.comment).length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics. Please try again later.");
    }
  };

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      setMemories(data);
    } catch (err) {
      setError("Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password confirmation if a new password is being set
    if (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate that at least one field is being changed
    if (!passwordForm.newPassword && !passwordForm.newUsername) {
      setError("Please provide either a new username or password");
      return;
    }

    try {
      setLoading(true);
      await authService.changeAdminPassword(
        passwordForm.oldPassword,
        passwordForm.newPassword || null,
        passwordForm.newUsername || null
      );
      setSuccess("Credentials updated successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        newUsername: "",
      });
    } catch (err) {
      setError(err.error || "Failed to update credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCredentialsUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await authService.updateGuestCredentials(
        guestForm.username,
        guestForm.password
      );
      setSuccess("Guest credentials updated successfully");
      setGuestForm({ username: "", password: "" });
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err.error || "Failed to update guest credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const data = await galleryService.exportData();

      // Create and download file
      const blob = new Blob([data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `wedding-guestbook-export-${
          new Date().toISOString().split("T")[0]
        }.json`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess("Data exported successfully");
    } catch (err) {
      setError("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    
    try {
      setLoading(true);
      await galleryService.deleteImage(id);
      await fetchMemories();
      setSuccess("Memory deleted successfully");
    } catch (err) {
      setError("Failed to delete memory");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (memory) => {
    if (!memory || !memory.id) {
      setError("Invalid memory data for download");
      return;
    }
    
    try {
      // If it's just an image with no message, use the original image download
      if (memory.image && !memory.image.includes('placeholder') && !memory.comment) {
        await galleryService.downloadImage(memory.image, memory.id);
        setSuccess("Image downloaded successfully");
        return;
      }

      // Create an HTML template that matches the book style
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Memory from ${memory.name}</title>
      <style>
        body {
          font-family: "Playfair Display", serif;
          max-width: 800px;
          margin: 20px auto;
          padding: 30px;
          background-color: #FAF9F6;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .memory-card {
          text-align: center;
        }
        .title {
          color: #2e6f40;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .image-container {
          margin: 20px 0;
        }
        img {
          max-width: 100%;
          max-height: 500px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .message {
          font-size: 18px;
          line-height: 1.6;
          color: #2c3e50;
          margin: 20px 0;
          font-style: italic;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
        }
        .name {
          color: #2e6f40;
          font-weight: bold;
          font-size: 20px;
        }
        .date {
          color: #95a5a6;
          font-size: 16px;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="memory-card">
        <h1 class="title">A Snap in Time</h1>
        ${memory.image && !memory.image.includes('placeholder') ? 
          `<div class="image-container">
            <img src="${memory.image}" alt="Memory from ${memory.name}">
          </div>` : ''
        }
        ${memory.comment ? 
          `<div class="message">
            ${memory.comment}
          </div>` : ''
        }
        <div class="footer">
          <div class="name">${memory.name}</div>
          <div class="date">${new Date(memory.uploaded_at).toLocaleDateString()}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create and download the HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `memory-${memory.name}-${new Date(memory.uploaded_at).toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  setSuccess("Memory downloaded successfully");
} catch (err) {
  console.error('Error downloading memory:', err);
  setError("Failed to download memory. Please try again.");
}
};

  const handleDownloadImage = async (memory) => {
        if (!memory || !memory.id || !memory.image) {
          setError("Invalid memory data for download");
          return;
        }
        
        try {
          await galleryService.downloadImage(memory.image, memory.id);
          setSuccess("Image downloaded successfully");
        } catch (err) {
          console.error('Error downloading image:', err);
          setError("Failed to download image. Please try again.");
        }
      };
      
  const handleDownloadMemory = async (memory) => {
        if (!memory || !memory.id) {
          setError("Invalid memory data for download");
          return;
        }
        
        try {
  
      // Create an HTML template that matches the book style
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Memory from ${memory.name}</title>
          <style>
            body {
              font-family: "Playfair Display", serif;
              max-width: 800px;
              margin: 20px auto;
              padding: 30px;
              background-color: #FAF9F6;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .memory-card {
              text-align: center;
            }
            .title {
              color: #2e6f40;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .image-container {
              margin: 20px 0;
            }
            img {
              max-width: 100%;
              max-height: 500px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .message {
              font-size: 18px;
              line-height: 1.6;
              color: #2c3e50;
              margin: 20px 0;
              font-style: italic;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
            }
            .name {
              color: #2e6f40;
              font-weight: bold;
              font-size: 20px;
            }
            .date {
              color: #95a5a6;
              font-size: 16px;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="memory-card">
            <h1 class="title">A Snap in Time</h1>
            ${memory.image && !memory.image.includes('placeholder') ? 
              `<div class="image-container">
                <img src="${memory.image}" alt="Memory from ${memory.name}">
              </div>` : ''
            }
            ${memory.comment ? 
              `<div class="message">
                ${memory.comment}
              </div>` : ''
            }
            <div class="footer">
              <div class="name">${memory.name}</div>
              <div class="date">${new Date(memory.uploaded_at).toLocaleDateString()}</div>
            </div>
          </div>
        </body>
        </html>
      `;
  
      // Create and download the HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory-${memory.name}-${new Date(memory.uploaded_at).toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess("Memory downloaded successfully");
    } catch (err) {
      console.error('Error downloading memory:', err);
      setError("Failed to download memory. Please try again.");
    }
  };

  const filteredMemories = memories.filter(memory => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        memory.name.toLowerCase().includes(searchLower) ||
        (memory.comment && memory.comment.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
  
    switch (filter) {
      case 'photos':
        // Show entries that have photos (regardless of messages)
        return memory.image && !memory.image.includes('placeholder');
      case 'messages':
        // Show entries that have ONLY messages (no photos)
        return memory.comment && (!memory.image || memory.image.includes('placeholder'));
      default:
        // Show all entries
        return true;
    }
  });

  return (
    <DashboardContainer>
      <BackLink to="/">← Back to Guestbook</BackLink>
      <Header>
        <TitleContainer>
          <Title>Admin Dashboard</Title>
          <HeartDivider src="/images/heart-divider.svg" alt="Heart Divider" />
        </TitleContainer>
      </Header>

      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      <TabContainer>
        <Tab
          $active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Tab>
        <Tab
          $active={activeTab === "gallery"}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery Management
        </Tab>
        <Tab
          $active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </Tab>
      </TabContainer>

      {activeTab === "overview" && (
        <>
          <StatsGrid>
            <StatCard>
              <h3>Total Photos</h3>
              <p>{stats.totalImages}</p>
            </StatCard>
            <StatCard>
              <h3>Total Messages</h3>
              <p>{stats.totalMessages}</p>
            </StatCard>
          </StatsGrid>
        </>
      )}

      {activeTab === "gallery" && (
        <>
          <SearchBar
            type="text"
            placeholder="Search memories by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterContainer>
            <FilterButton
              $active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All Memories
            </FilterButton>
            <FilterButton
              $active={filter === "photos"}
              onClick={() => setFilter("photos")}
            >
              Photos Only
            </FilterButton>
            <FilterButton
              $active={filter === "messages"}
              onClick={() => setFilter("messages")}
            >
              Messages Only
            </FilterButton>
          </FilterContainer>
          <GalleryGrid>
            {filteredMemories.length === 0 ? (
              <NoMemories>No memories found</NoMemories>
            ) : (
              filteredMemories.map(memory => (
                <MemoryCard key={memory.id}>
                  {memory.image && !memory.image.includes('placeholder') && (
                    <MemoryImage src={memory.image} alt={`Memory from ${memory.name}`} />
                  )}
                  <MemoryContent>
                    <MemoryName>{memory.name}</MemoryName>
                    {memory.comment && (
                      <MemoryMessage>{memory.comment}</MemoryMessage>
                    )}
                    <MemoryDate>
                      {new Date(memory.uploaded_at).toLocaleDateString()}
                    </MemoryDate>
                  </MemoryContent>
                  <ActionButtons>
                    {(memory.image && !memory.image.includes('placeholder')) || memory.comment ? (
                      <>
                      {memory.image && !memory.image.includes('placeholder') && (
                        <ActionButton
                          className="download"
                          onClick={() => handleDownloadImage(memory)}
                        >
                            📸 Image download
                        </ActionButton>
                      )}
                        <ActionButton
                          className="download"
                          onClick={() => handleDownloadMemory(memory)}
                        >
                          📖 Memory download
                        </ActionButton>
                      </>
                    ) : null}
                    <ActionButton
                      className="delete"
                      onClick={() => handleDelete(memory.id)}
                    >
                      🗑️ Delete
                    </ActionButton>
                  </ActionButtons>
                </MemoryCard>
              ))
            )}
          </GalleryGrid>
        </>
      )}

      {activeTab === "settings" && (
        <>
          <Card>
            <HeaderTitle>
              Update Admin Credentials{" "}
            </HeaderTitle>
            <Form onSubmit={handlePasswordChange}>
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                required
              />
              <Input
                type="text"
                placeholder="New Username (optional)"
                value={passwordForm.newUsername}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newUsername: e.target.value,
                  }))
                }
              />
              <Input
                type="password"
                placeholder="New Password (optional)"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                disabled={!passwordForm.newPassword}
                required={!!passwordForm.newPassword}
              />
              <Button type="submit" disabled={loading}>
                Update Credentials
              </Button>
            </Form>
          </Card>

          <Card>
            <HeaderTitle>
              Update Guest Access{" "}
            </HeaderTitle>
            <Form onSubmit={handleGuestCredentialsUpdate}>
              <Input
                type="text"
                placeholder="Guest Username"
                value={guestForm.username}
                onChange={(e) =>
                  setGuestForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
              />
              <Input
                type="password"
                placeholder="Guest Password"
                value={guestForm.password}
                onChange={(e) =>
                  setGuestForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
              <Button type="submit" disabled={loading}>
                Update Guest Access
              </Button>
            </Form>
          </Card>
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </DashboardContainer>
  );
};

export default AdminDashboard;
