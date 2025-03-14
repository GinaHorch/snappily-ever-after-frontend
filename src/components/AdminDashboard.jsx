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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align the button correctly */
  margin-bottom: 30px;
`;

const TitleContainer = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  color: #2e6f40;
  margin-top: 60px;
  margin-bottom: -15px;
  margin-left: 220px;
  margin-right: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
`;

const HeartDivider = styled.img`
  display: block;
  margin: 20px auto;
  padding-bottom: 20px;
  padding-top: 0px;
  width: 80%; /* Adjust size as needed */
  max-width: 400px; /* Optional: To limit the maximum width */
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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

  &:hover {
    background-color: ${(props) => (props.$active ? "#9daf89" : "#eee")};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px #6666b3;
  max-width: 600px;
  padding: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
  margin: 40px auto 20px; // This will horizontally center the card
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  padding-left: 40px;
  padding-right: 0px;
  padding-top: 12px;
  padding-bottom: 18px;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #2e6f40;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Lato", sans-serif;

  &:focus {
    outline: none;
    border-color: #2e6f40;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #6666b3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  transition: background-color 0.3s ease;

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
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px #6666b3;
  text-align: center;

  h3 {
    margin: 0;
    color: #2e6f40;
    font-size: 0.9em;
    text-transform: uppercase;
  }

  p {
    margin: 10px 0 0;
    font-size: 2em;
    color: #2e6f40;
    font-weight: bold;
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
`;

const FlipSymbol = styled.span`
  display: inline-block;
  transform: ${(props) => (props.flip ? "scaleX(-1)" : "none")};
  margin: 0 8px;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalImages: 0,
    totalMessages: 0,
    activeGroups: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Guest credentials form
  const [guestForm, setGuestForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const images = await galleryService.getAllImages();
      const groups = await galleryService.getAllGroups();

      setStats({
        totalImages: images.length,
        totalMessages: images.filter((img) => img.message).length,
        activeGroups: groups.filter((group) => group.is_active).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await authService.changeAdminPassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      setSuccess("Password updated successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.error || "Failed to update password");
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

  return (
    <DashboardContainer>
      <BackLink to="/">← Back to Guestbook</BackLink>

      <Header>
        <TitleContainer>
          <Title>Admin Dashboard</Title>
        </TitleContainer>
        <ButtonContainer>
          <Button
            onClick={handleExportData}
            disabled={loading}
            style={{ marginTop: "40px" }}
          >
            Export Data
          </Button>
        </ButtonContainer>
      </Header>

      {/* Heart Divider Image */}
      <HeartDivider src="/images/heart-divider.svg" alt="Heart Divider" />

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
            <StatCard>
              <h3>Active Groups</h3>
              <p>{stats.activeGroups}</p>
            </StatCard>
          </StatsGrid>
        </>
      )}

      {activeTab === "settings" && (
        <>
          <Card>
            <HeaderTitle>
              Update Admin Password{" "}
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
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
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
                required
              />
              <Button type="submit" disabled={loading}>
                Update Password
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
