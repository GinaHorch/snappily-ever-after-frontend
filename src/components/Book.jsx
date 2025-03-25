import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import styled from "styled-components";
import Confetti from "react-confetti";
import LoginForm from "./LoginForm";
import GalleryGrid from "./GalleryGrid";
import { authService } from "../services/auth";
import { galleryService } from "../services/gallery";
import { Link, useNavigate } from "react-router-dom";

const BookContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 0;
  position: relative;
  overflow: hidden;

  .demo-book {
    width: 100% !important;
    max-width: 320px !important;
    margin: 0 !important;
    left: 0 !important;
    right: 0 !important;
    position: relative !important;

    @media (max-width: 320px) {
      padding: 0 !important;
      margin: 0 !important;
      left: 0 !important;
      right: 0 !important;
      max-width: 100% !important;
    }

    @media (min-width: 375px) and (max-width: 411px) {
      max-width: 355px !important;
      margin: 0 auto !important;
      padding: 0 10px !important;
    }

    @media (min-width: 412px) and (max-width: 599px) {
      max-width: 392px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
    }

    @media (min-width: 600px) and (max-width: 768px) {
      max-width: 550px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
    }

    @media (min-width: 769px) {
      max-width: 1400px !important;
    }
  }

  @media (max-width: 320px) {
    padding: 0;
  }

  @media (min-width: 375px) and (max-width: 411px) {
    padding: 10px;
    height: calc(100vh - 40px);
  }

  @media (min-width: 412px) and (max-width: 599px) {
    padding: 0;
    height: calc(100vh - 40px);
    justify-content: center;
  }

  @media (min-width: 600px) and (max-width: 768px) {
    padding: 0;
    height: calc(100vh - 40px);
    justify-content: center;
  }
`;

const CoverContent = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.$isAuthenticated ? 'flex-start' : 'space-between'};
  position: relative;
  padding: ${props => props.$isAuthenticated ? '10px' : '20px 10px'};
  overflow-y: auto;

  @media (max-width: 450px) {
    padding: 8px;
  }

  @media (max-width: 320px) {
    padding: 5px;
  }

  h1 {
    pointer-events: none;
    color: white;
    font: "Parisienne";
    font-weight: bold;
    font-size: ${props => props.$isAuthenticated ? '60px' : '45px'};
    margin-bottom: 0px;
    padding: 0 10px;
    margin-top: ${props => props.$isAuthenticated ? '10px' : '0'};

    @media (max-width: 560px) {
      font-size: ${props => props.$isAuthenticated ? '50px' : '40px'};
    }

    @media (max-width: 500px) {
      font-size: ${props => props.$isAuthenticated ? '45px' : '35px'};
    }

    @media (max-width: 400px) {
      font-size: ${props => props.$isAuthenticated ? '40px' : '30px'};
    }

    @media (max-width: 320px) {
      font-size: ${props => props.$isAuthenticated ? '35px' : '25px'};
    }
  }

  p {
    pointer-events: none;
    color: #2e6f40;
    font-weight: bold;
    font-size: 20px;
    margin-top: 0px;
    padding: 0 10px;

    @media (max-width: 500px) {
      font-size: 18px;
      padding: 0 15px;
    }

    @media (max-width: 400px) {
      font-size: 16px;
    }

    @media (max-width: 320px) {
      font-size: 15px;
    }
  }

  img {
    margin-top: 10px;
    margin-bottom: -20px;
    max-width: 80%;
    height: 300px;
    object-fit: contain;

    @media (max-width: 560px) {
      height: 250px;
      margin-bottom: -15px;
    }

    @media (max-width: 500px) {
      height: 200px;
      margin-bottom: -10px;
    }

    @media (max-width: 400px) {
      height: 180px;
      margin-bottom: -5px;
      max-width: 90%;
    }

    @media (max-width: 320px) {
      height: 160px;
      margin-bottom: 0;
      max-width: 95%;
    }
  }

  .login-area {
    position: relative;
    z-index: 1000;
    width: 100%;
    max-width: 280px;
    background: rgba(157, 175, 137, 0.95);
    padding: 20px;
    border-radius: 8px;
    margin: 10px auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const PageContent = styled.div`
  opacity: ${(props) => (props.$isAuthenticated ? 1 : 0)};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  overflow-y: auto;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  margin-top: 6px; /* Reduced margin-top to move the text up */
`;

const PageNumber = styled.div`
  position: absolute;
  bottom: 20px;
  font-family: "Playfair Display", serif;
  color: #95a5a6;
  font-size: 0.9em;
  width: 100%;
  text-align: center;
`;

const TurnPageHint = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(44, 62, 80, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.9em;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const NavigationButtons = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 70%, rgba(255,255,255,0) 100%);
  padding: 10px;
  height: 60px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const NavButton = styled.button`
  background: rgba(46, 111, 64, 0.9);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  white-space: nowrap;
  flex: 1;
  max-width: 120px;
  min-height: 35px;
  font-size: 13px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(46, 111, 64, 1);
  }

  &:disabled {
    background: rgba(149, 165, 166, 0.8);
    cursor: not-allowed;
  }

  @media (min-width: 769px) {
    padding: 10px 20px;
    font-size: 14px;
    max-width: 150px;
  }

  @media (max-width: 360px) {
    max-width: 80px;
    padding: 8px 10px;
    
    &[data-direction="prev"]::before {
      content: "←";
    }
    
    &[data-direction="next"]::before {
      content: "→";
    }
    
    span {
      display: none;
    }
  }
`;

const CameraIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-top: 10px; /* Adjusted to place it above the title */
  margin-bottom: 10px;
  cursor: pointer;
`;

const GuestbookIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-top: 10px; /* Adjusted to place it above the title */
  margin-bottom: 10px;
  cursor: pointer;
`;

const ThankfulIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px; /* Space between the icon and title */
  cursor: pointer;
`;

const MessageIcon = styled.img`
  width: 40px;
  height: 40px;
  opacity: 0.8;
`;

const PageContainer = styled.div.attrs(props => ({
  'data-is-cover': props.$isCover
}))`
  background-color: ${(props) => (props.$isCover ? "#9daf89" : "#FAF9F6")};
  border: 1px solid #c2c2c2;
  border-radius: ${(props) => props.$isCover ? "0 10px 10px 0" : "0"};
  box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  padding: 0.3cm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;

  @media (min-width: 769px) {
    padding: 0.5cm;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0.3cm;
    left: 0.3cm;
    right: 0.3cm;
    bottom: 0.3cm;
    border: 2px solid ${(props) => (props.$isCover ? "white" : "#2e6f40")};
    border-radius: 20px;
    pointer-events: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);

    @media (max-width: 768px) {
      top: 0.3cm;
      left: 0.3cm;
      right: 0.3cm;
      bottom: 0.3cm;
    }
  }

  /* Book spine effect, only on cover */
  ${(props) =>
    props.$isCover &&
    `&::after {
      content: "";
      position: absolute;
      top: 0;
      left: -15px;
      width: 20px;
      height: 100%;
      background: #6e7e4e;
      border-radius: 5px;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
    }`}
  box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4),
    3px 0 10px rgba(0, 0, 0, 0.2);
`;

const PageTitle = styled.h2`
  margin-bottom: 20px;
  font-family: "Playfair Display", serif;
  color: ${(props) =>
    props.$isCover
      ? "#2c3e50"
      : "#2e6f40"}; /* Use #2e6f40 for non-cover pages */
`;

const Page = ({ number, isCover, children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return (
    <PageContainer $isCover={isCover} $isAuthenticated={isAuthenticated}>
      {children}
      {number && <PageNumber>{number}</PageNumber>}
    </PageContainer>
  );
};

const BackCover = styled(PageContainer)`
  background-color: #9daf89;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  color: white;
  position: relative;

  img {
    width: 180px;
    height: 180px;
    margin-bottom: 3rem;
    opacity: 0.85;
    filter: brightness(1.1) saturate(0.9);
    object-fit: contain;
  }

  p {
    font-family: "Playfair Display", serif;
    color: white;
    font-size: 1.8em;
    line-height: 1.6;
    margin-top: 1.5rem;
    letter-spacing: 0.05em;
    font-weight: 300;
  }

  h2 {
    font-family: "Playfair Display", serif;
    color: white;
    font-size: 3em;
    margin-top: 1rem;
    letter-spacing: 0.02em;
    font-weight: 400;
  }

  @media (max-width: 600px) {
    img {
      width: 150px;
      height: 150px;
      margin-bottom: 2rem;
    }

    p {
      font-size: 1.5em;
    }

    h2 {
      font-size: 2.8em;
    }
  }
`;

const MemoryPageContent = styled.div`
    opacity: ${(props) => (props.$isAuthenticated ? 1 : 0)};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ${props => props.$textOnly ? 'center' : 'flex-start'};
    padding: 20px;
    overflow-y: auto;

    @media (max-width: 600px) {
        padding: 20px;
        gap: 15px;
    }
`;

const MemoryImage = styled.img`
  width: 100%;
  max-height: 60%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MemoryMessage = styled.p`
  font-family: "Playfair Display", serif;
  font-size: ${props => props.$textOnly ? '1.3em' : '1.1em'};
  line-height: 1.6;
  color: #2c3e50;
  text-align: center;
  margin: ${props => props.$textOnly ? '30px 0' : '15px 0'};
  font-style: ${props => props.$textOnly ? 'normal' : 'italic'};
  max-width: 80%;
`;

const TextOnlyDecoration = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 2px solid rgba(46, 111, 64, 0.2);
  }
  
  &::before {
    margin-right: 20px;
  }
  
  &::after {
    margin-left: 20px;
  }
`;

const MemoryFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-top: auto;
`;

const GuestName = styled.span`
  font-family: "Playfair Display", serif;
  font-weight: 600;
  color: #2e6f40;
  font-size: 1.2em;
`;

const DateStamp = styled.span`
  font-family: "Playfair Display", serif;
  color: #95a5a6;
  font-size: 0.9em;
`;

const Book = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [submissions, setSubmissions] = useState([]);
  const [showBook, setShowBook] = useState(true);
  const bookRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef(null);


  // Add a constant for fixed pages (excluding dynamic submission pages)
  const FIXED_PAGES = {
    FRONT_COVER: 0,
    GALLERY_GRID: 1,
    FINAL_MESSAGE: 2,
    BACK_COVER: 3
  };

  const totalPages = submissions.length + Object.keys(FIXED_PAGES).length;

  // Replace the initialization effect with a dimensions calculation effect
  useEffect(() => {
    const calculateDimensions = () => {
      // For unauthenticated state, use smaller dimensions for login form
      if (!isAuthenticated) {
        const baseWidth = Math.min(320, window.innerWidth - 80);
        const baseHeight = Math.min(686, window.innerHeight - 120);
        
        // Adjust dimensions based on screen size
        const width = window.innerWidth <= 320 ? baseWidth :
                     window.innerWidth <= 375 ? 300 :
                     window.innerWidth <= 412 ? 320 :
                     window.innerWidth <= 600 ? 350 :
                     400;
        
        const height = window.innerWidth <= 320 ? baseHeight :
                      window.innerWidth <= 375 ? 600 :
                      window.innerWidth <= 412 ? 650 :
                      window.innerWidth <= 600 ? 686 :
                      700;

        setDimensions({ width, height });
        setIsInitialized(true);
        setLoading(false);
        return;
      }

      // For authenticated state, use full book dimensions
      const width = isMobile ? (
        window.innerWidth >= 600 ? 550 :
        window.innerWidth >= 412 ? 392 :
        window.innerWidth >= 375 ? 355 :
        320
      ) : 550;

      const height = isMobile ? (
        window.innerWidth >= 600 ? Math.min(800, window.innerHeight - 100) :
        window.innerWidth >= 412 ? Math.min(750, window.innerHeight - 80) :
        Math.min(600, window.innerHeight - 60)
      ) : Math.min(900, window.innerHeight - 100);

      setDimensions({ width, height });
      setIsInitialized(true);
      setLoading(false);
    };

    calculateDimensions();
  }, [isMobile, isAuthenticated]);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async () => {
    try {
      console.log('Starting login process...');
      await onLogin();
      
      const isAuthed = authService.isAuthenticated();
      console.log('Login completed, auth status:', isAuthed);
      
      if (isAuthed) {
        setIsAuthenticated(true);
        setShowConfetti(true);
        
        // Reset book state
        if (bookRef.current && bookRef.current.pageFlip) {
          bookRef.current.pageFlip().flip(0);
        }
        setPage(0);
        
        // Trigger refresh
        setRefreshTrigger(prev => !prev);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  // ✅ Define image upload success handler here
  const handleImageUploadSuccess = (newImage) => {
    console.log("New image received:", newImage);
    fetchSubmissions(); // Directly fetch submissions instead of using refreshTrigger
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Fetching submissions via useEffect...");
      fetchSubmissions();
    }
  }, [refreshTrigger, isAuthenticated]);

  const fetchSubmissions = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      console.log("Fetched submissions Book.jsx:", data);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      if (err.response?.status === 401) {
        // If unauthorized, refresh the token instead of logging out
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // Re-authenticate silently
            await authService.refreshToken();
            // Retry fetching submissions
            const data = await galleryService.getAllImages();
            setSubmissions(data);
            setError(null);
            return;
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // confetti effect
  useEffect(() => {
    if (isAuthenticated) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAuthenticated) return;

      if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "ArrowLeft") {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated]);

  const nextPage = () => {
    if (bookRef.current && bookRef.current.pageFlip) {
      console.log("Attempting to flip to next page");
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current && bookRef.current.pageFlip) {
      console.log("Attempting to flip to previous page");
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e) => {
    console.log("Page flipped to:", e.data);
    setPage(e.data);
  };

  return (
    <BookContainer ref={containerRef}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          colors={["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"]}
        />
      )}
      {showBook && (
        <div className="book-wrapper">
          <HTMLFlipBook
            key={`book-${isAuthenticated}-${loading}-${submissions.length}`}
            ref={bookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={280}
            maxWidth={dimensions.width}
            minHeight={400}
            maxHeight={dimensions.height}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={isAuthenticated}
            className="demo-book"
            disabled={!isAuthenticated}
            flippingTime={1000}
            useMouseEvents={false}
            swipeDistance={0}
            clickEventForward={false}
            usePortrait={isMobile}
            startPage={0}
            onFlip={onFlip}
            drawShadow={true}
            autoSize={true}
          >
            {/* Cover Page */}
            <div className="page">
              <Page isCover={true}>
                <CoverContent $isAuthenticated={isAuthenticated}>
                  <h1>Katie & Alex</h1>
                  <p>Wedding Guest Book & Photo Album</p>
                  <img src="/images/cat_wedding.png" alt="Wedding image" />
                  {!isAuthenticated && (
                    <div className="login-area">
                      <LoginForm onLogin={handleLogin} />
                    </div>
                  )}
                </CoverContent>
              </Page>
            </div>

            {/* Memory Pages */}
            {submissions.map((submission, index) => (
              <div className="page" key={`memory-${submission.id}`}>
                <Page number={index + 1}>
                  <MemoryPageContent 
                    $isAuthenticated={isAuthenticated}
                    $textOnly={!submission.image || submission.image.includes('placeholder')}
                  >
                    <PageTitle $isCover={false}>A Snap in Time</PageTitle>
                    
                    {submission.image && !submission.image.includes('placeholder') ? (
                      <>
                        <MemoryImage src={submission.image} alt={`Memory from ${submission.name}`} />
                        <MemoryMessage>
                          {submission.comment || "Captured a beautiful moment!"}
                        </MemoryMessage>
                      </>
                    ) : (
                      <>
                        <TextOnlyDecoration>
                          <MessageIcon src="/images/message-icon.svg" alt="Message" />
                        </TextOnlyDecoration>
                        <MemoryMessage $textOnly>
                          {submission.comment}
                        </MemoryMessage>
                      </>
                    )}
                    
                    <MemoryFooter>
                      <GuestName>{submission.name}</GuestName>
                      <DateStamp>{new Date(submission.uploaded_at).toLocaleDateString()}</DateStamp>
                    </MemoryFooter>
                  </MemoryPageContent>
                </Page>
              </div>
            ))}

            {/* Gallery Grid Page */}
            <div className="page">
              <Page number={submissions.length + 1}>
                <PageContent $isAuthenticated={isAuthenticated}>
                  <CameraIcon
                    src="/images/cameraheart-icon.svg"
                    alt="Camera Icon"
                    onClick={() => console.log("Camera Icon Clicked")}
                  />
                  <PageTitle $isCover={false}>Snappily Collected Moments</PageTitle>
                  <GalleryGrid refreshTrigger={refreshTrigger} />
                </PageContent>
              </Page>
            </div>

            {/* Final Message Page */}
            <div className="page">
              <Page number={submissions.length + 2}>
                <PageContent $isAuthenticated={isAuthenticated}>
                  <ThankfulIcon
                    src="/images/thankful-icon.svg"
                    alt="Thankful Icon"
                  />
                  <PageTitle $isCover={false}>Snappily Ever After</PageTitle>
                  <p style={{ textAlign: 'center', margin: '1rem 0' }}>And just like that, our adventure begins!</p>
                  <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                    Thank you for making our day unforgettable – for the laughter, the love, and the questionable dance moves!
                  </p>
                  <p style={{ textAlign: 'center', margin: '1rem 0' }}>
                    This book is filled with all the memories you helped create.
                  </p>
                  <p style={{ textAlign: 'center', margin: '2rem 0', fontStyle: 'italic' }}>
                    Here's to many more chapters together!
                  </p>
                </PageContent>
              </Page>
            </div>

            {/* Back Cover */}
            <div className="page">
              <BackCover>
                <img 
                  src="/images/cat_wedding.png" 
                  alt="Wedding cats" 
                  style={{ 
                    transform: 'scale(1.1)',
                    filter: 'brightness(1.1) saturate(0.9) opacity(0.85)'
                  }} 
                />
                <p>With love</p>
                <h2>Katie & Alex</h2>
              </BackCover>
            </div>
          </HTMLFlipBook>
            
          {isAuthenticated && (
            <NavigationButtons>
              <NavButton 
                onClick={prevPage} 
                disabled={page === 0}
                data-direction="prev"
              >
                <span>← Previous Page</span>
              </NavButton>
              <NavButton 
                onClick={() => navigate('/')}  
                style={{ 
                  backgroundColor: '#9daf89',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 15px'
                }}
              >
                <img 
                  src="/images/cameraheart-icon.svg" 
                  alt="Camera" 
                  style={{ width: '20px', height: '20px' }}
                />
                <span>Share a Memory</span>
              </NavButton>
              <NavButton 
                onClick={nextPage} 
                disabled={page === totalPages - 1}
                data-direction="next"
              >
                <span>Next Page →</span>
              </NavButton>
            </NavigationButtons>
          )}
        </div>
      )}
    </BookContainer>
  );
};

export default Book;
