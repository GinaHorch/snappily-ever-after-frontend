import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import styled from "styled-components";
import Confetti from "react-confetti";
import LoginForm from "./LoginForm";
import PhotoUpload from "./PhotoUpload";
import GalleryGrid from "./GalleryGrid";
import { authService } from "../services/auth";

const PageContainer = styled.div.attrs(props => ({
  'data-is-cover': props.$isCover
}))`
  background-color: ${(props) => (props.$isCover ? "#9daf89" : "#FAF9F6")};
  border: 1px solid #c2c2c2;
  border-radius: ${(props) =>
    props.$isCover ? "0 10px 10px 0" : "0"}; /* Only rounded corners on cover */
  box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  padding: 1cm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 1cm;
    left: 1cm;
    right: 1cm;
    bottom: 1cm;
    border: 2px solid ${(props) => (props.$isCover ? "white" : "#2e6f40")}; /* White border for cover, #2e6f40 for other pages */
    border-radius: 20px;
    pointer-events: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
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

const BookContainer = styled.div`
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CoverContent = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;

  h1 {
    pointer-events: none;
    color: white;
    font: "Parisienne";
    font-weight: bold;
    font-size: 60px;
    margin-bottom: 0px;
    padding: 0 10px;

    @media (max-width: 560px) {
      font-size: 50px;
    }

    @media (max-width: 500px) {
      font-size: 45px;
      padding: 0 15px;
    }

    @media (max-width: 400px) {
      font-size: 40px;
      padding: 0 10px;
      margin-top: 20px;
    }

    @media (max-width: 320px) {
      font-size: 35px;
      margin-top: 30px;
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
    margin-top: 0px;
    margin-bottom: -40px;
    max-width: 80%;
    height: 350px;
    object-fit: contain;

    @media (max-width: 560px) {
      height: 300px;
      margin-bottom: -30px;
    }

    @media (max-width: 500px) {
      height: 250px;
      margin-bottom: -20px;
    }

    @media (max-width: 400px) {
      height: 200px;
      margin-bottom: -15px;
      max-width: 90%;
    }

    @media (max-width: 320px) {
      height: 180px;
      margin-bottom: -10px;
      max-width: 95%;
    }
  }

  .login-area {
    position: relative;
    z-index: 1000;
    width: 100%;
    max-width: 300px;
    background: #9daf89;
    padding: 20px;
    border-radius: 8px;

    @media (max-width: 400px) {
      max-width: 280px;
      padding: 15px;
    }

    @media (max-width: 320px) {
      max-width: 260px;
      padding: 12px;
    }
  }
`;

const PageContent = styled.div`
  opacity: ${(props) => (props.$isAuthenticated ? 1 : 0)};
  transition: opacity 0.3s ease;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  overflow-y: auto;
`;

const PageTitle = styled.h2`
  margin-bottom: 20px;
  font-family: "Playfair Display", serif;
  color: ${(props) =>
    props.$isCover
      ? "#2c3e50"
      : "#2e6f40"}; /* Use #2e6f40 for non-cover pages */
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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 1000;
  width: auto;
  justify-content: center;
  padding: 0 20px;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    gap: 10px;
    bottom: 15px;
    width: 100%;
    max-width: 400px;
    background: linear-gradient(to top, rgba(255,255,255,0.95) 60%, rgba(255,255,255,0));
    padding: 15px 20px;
  }

  @media (max-width: 450px) {
    gap: 10px;
  }
`;

const NavButton = styled.button`
  background: rgba(46, 111, 64, 0.9);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  white-space: nowrap;
  flex: 1;
  max-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(46, 111, 64, 1);
  }

  &:disabled {
    background: rgba(149, 165, 166, 0.8);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 15px;
    font-size: 14px;
    max-width: 120px;
  }

  @media (max-width: 450px) {
    padding: 10px;
    font-size: 13px;
    max-width: 100px;
    
    &[data-direction="prev"]::before {
      content: "← Prev";
    }
    
    &[data-direction="next"]::before {
      content: "Next →";
    }
    
    span {
      display: none;
    }
  }

  @media (max-width: 360px) {
    max-width: 80px;
    
    &[data-direction="prev"]::before {
      content: "←";
    }
    
    &[data-direction="next"]::before {
      content: "→";
    }
  }
`;

const NavButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 450px) {
    gap: 10px;
  }
`;

const NavInstructions = styled.div`
  color: #2e6f40;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 10px;
  font-family: "Lato", sans-serif;
  opacity: ${props => props.$show ? 0.8 : 0};

  @media (max-width: 768px) {
    font-size: 0.85em;
    margin-bottom: 8px;
  }

  @media (max-width: 450px) {
    font-size: 0.8em;
    margin-bottom: 6px;
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
  width: 67px;
  height: 67px;
  margin-top: 3px;
  margin-bottom: 0px;
  cursor: pointer;
`;

const Page = ({ number, isCover, children }) => {
  return (
    <PageContainer $isCover={isCover}>
      {children}
      {number && <PageNumber>{number}</PageNumber>}
    </PageContainer>
  );
};

const Book = ({ onLogin }) => {
  const [submissions, setSubmissions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [page, setPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const bookRef = useRef(null);
  const isAuthenticated = authService.isAuthenticated();

  // Add effect to fetch submissions when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      setRefreshTrigger(prev => !prev); // This will trigger a refresh in GalleryGrid
    }
  }, [isAuthenticated]);

  // ✅ Define image upload success handler here
  const handleImageUploadSuccess = (newImage) => {
    console.log("New image received:", newImage); // ✅ Debugging step
    setRefreshTrigger((prev) => !prev); // ✅ Trigger gallery refresh
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

  const handleLogin = () => {
    onLogin(); // Call the parent's onLogin handler
  };

  const nextPage = () => {
    if (bookRef.current) {
      console.log("Attempting to flip to next page");
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      console.log("Attempting to flip to previous page");
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e) => {
    console.log("Page flipped to:", e.data);
    setPage(e.data);
  };

  const photoSubmissions = submissions.filter((sub) => sub.image);
  const messageSubmissions = submissions.filter((sub) => sub.comment);

  return (
    <BookContainer>
      
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          colors={["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"]}
        />
      )}
      <HTMLFlipBook
        ref={bookRef}
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={isAuthenticated}
        className="demo-book"
        disabled={true}
        flippingTime={1000}
        useMouseEvents={false}
        swipeDistance={0}
        clickEventForward={false}
        usePortrait={true}
        startPage={0}
        onFlip={onFlip}
        drawShadow={true}
        autoSize={true}
        renderOnlyPageLengthChange={false}
      >
        <div className="page">
          <Page isCover={true} >
            <CoverContent>
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

        <div className="page">
          <Page number="1" >
            <PageContent $isAuthenticated={isAuthenticated}>
              <GuestbookIcon
                src="/images/guestbook-icon.svg"
                alt="Guestbook Icon"
                onClick={() => console.log("Guestbook Icon Clicked")}
              />
              <PageTitle $isCover={false}>Share Your Memory</PageTitle>
              <PhotoUpload setRefreshTrigger={setRefreshTrigger} onSuccess={handleImageUploadSuccess} />
            </PageContent>
          </Page>
        </div>

        <div className="page">
          <Page number="2" >
            <PageContent $isAuthenticated={isAuthenticated}>
              <CameraIcon
                src="/images/cameraheart-icon.svg"
                alt="Camera Icon"
                onClick={() => console.log("Camera Icon Clicked")}
              />
              <PageTitle $isCover={false}>Photo Gallery</PageTitle>
              <GalleryGrid refreshTrigger={refreshTrigger} />
            </PageContent>
          </Page>
        </div>

        <div className="page">
          <Page number="3" >
            <PageContent $isAuthenticated={isAuthenticated}>
              <MessageIcon
                src="/images/message-icon.svg"
                alt="Message Icon"
                onClick={() => console.log("Message Icon Clicked")}
              />
              <PageTitle $isCover={false}>Guest Messages</PageTitle>
              {messageSubmissions.length > 0 ? (
                 <GalleryGrid refreshTrigger={refreshTrigger} />
              ) : (
                <EmptyMessage>
                  No messages have been shared yet. Be the first!
                </EmptyMessage>
              )}
            </PageContent>
          </Page>
        </div>

        <div className="page">
          <Page number="">
            <PageContent $isAuthenticated={isAuthenticated}>
              <ThankfulIcon
                src="/images/thankful-icon.svg"
                alt="Thankful Icon"
              />
              <PageTitle $isCover={false}>Thank You</PageTitle>
              <p>For being part of our special day.</p>
            </PageContent>
          </Page>
        </div>
      </HTMLFlipBook>
      {isAuthenticated && (
        <>
          <NavigationButtons>
            <NavInstructions $show={showHint}>
              Use arrow keys or buttons to turn pages
            </NavInstructions>
            <NavButtonContainer>
              <NavButton 
                onClick={prevPage} 
                disabled={page === 0}
                data-direction="prev"
              >
                <span>← Previous Page</span>
              </NavButton>
              <NavButton 
                onClick={nextPage} 
                disabled={page === 4}
                data-direction="next"
              >
                <span>Next Page →</span>
              </NavButton>
            </NavButtonContainer>
          </NavigationButtons>
        </>
      )}
    </BookContainer>
  );
};

export default Book;
