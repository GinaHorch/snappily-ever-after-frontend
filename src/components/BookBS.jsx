// Book.jsx (mobile-first, uses Book.css for styling)
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Confetti from "react-confetti";
import LoginForm from "./LoginForm";
import PhotoUpload from "./PhotoUpload";
import GalleryGrid from "./GalleryGrid";
import { authService } from "../services/auth";
import { galleryService } from "../services/gallery";
import "./Book.css";

const Page = ({ number, isCover, children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return (
    <div
      className={`page-container ${isCover ? "cover" : ""}`}
      data-is-cover={isCover}
    >
      {children}
      {number && <div className="page-number">{number}</div>}
    </div>
  );
};

const Book = ({ onLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const bookRef = useRef(null);


  //   const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [page, setPage] = useState(0);
  //   const [showBook, setShowBook] = useState(true);
  // const containerRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const [isInitialized, setIsInitialized] = useState(false);



  // Add a constant for fixed pages (excluding dynamic submission pages)
  const FIXED_PAGES = {
    FRONT_COVER: 0,
    SHARE_MEMORY: 1,
    GALLERY_GRID: 2,
    FINAL_MESSAGE: 3,
    BACK_COVER: 4
  };

  const totalPages = submissions.length + Object.keys(FIXED_PAGES).length;
  useEffect(() => {
    if (isAuthenticated) {
      setRefreshTrigger(prev => !prev);
    }
  }, [isAuthenticated]);

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
    <div className="book-container">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          colors={["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"]}
        />
      )}

      <div className="book-wrapper">
        <HTMLFlipBook
          key={`book-${isAuthenticated}-${loading}-${submissions.length}`}

          className="demo-book"
          ref={bookRef}
          width={320}
          height={600}
          minWidth={280}
          minHeight={400}
          maxWidth={1000}
          maxHeight={700}
          size="stretch"
          autoSize={true}
          showCover={true}
          mobileScrollSupport={isAuthenticated}
          onFlip={onFlip}
          disabled={!isAuthenticated}
          flippingTime={1000}
          // useMouseEvents={false}
          swipeDistance={0}
          clickEventForward={false}
          startPage={0}
          drawShadow={true}
          maxShadowOpacity={0.5}
        >

          {/* Cover Page */}
          <div className="page">
            <Page isCover={true}>
              <div className="cover-content">
                <h1>Katie & Alex</h1>
                <p>Wedding Guest Book & Photo Album</p>
                <img src="/images/cat_wedding.png" alt="Wedding image" />
                {!isAuthenticated && (
                  <div className="login-area">
                    <LoginForm onLogin={handleLogin} />
                  </div>
                )}
              </div>
            </Page>
          </div>

          {/* Share Memory */}
          <div className="page">
            <Page number="1">
              <div className="page-content">
                <img
                  className="guestbook-icon"
                  src="/images/guestbook-icon.svg"
                  alt="Guestbook Icon"
                />
                <h2 className="page-title">Share Your Memory</h2>
                <PhotoUpload
                  setRefreshTrigger={setRefreshTrigger}
                  onSuccess={handleImageUploadSuccess}
                />
              </div>
            </Page>
          </div>

          {/* Dynamic Memory Pages */}
          {submissions.map((submission, index) => (
            <div className="page" key={`memory-${submission.id}`}>
              <Page number={index + 2}>
                <div
                  className={`memory-page-content ${!submission.image || submission.image.includes("placeholder")
                    ? "text-only"
                    : ""
                    }`}
                >
                  <h2 className="page-title">A Snap in Time</h2>

                  {submission.image && !submission.image.includes("placeholder") ? (
                    <>
                      <img
                        className="memory-image"
                        src={submission.image}
                        alt={`Memory from ${submission.name}`}
                      />
                      <p className="memory-message">
                        {submission.comment || "Captured a beautiful moment!"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-only-decoration">
                        <img
                          className="message-icon"
                          src="/images/message-icon.svg"
                          alt="Message"
                        />
                      </div>
                      <p className="memory-message text-only">
                        {submission.comment}
                      </p>
                    </>
                  )}

                  <div className="memory-footer">
                    <span className="guest-name">{submission.name}</span>
                    <span className="date-stamp">
                      {new Date(submission.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Page>
            </div>
          ))}

          <div className="page">
            <Page number={submissions.length + 2}>
              <div className="page-content">
                <img
                  className="camera-icon"
                  src="/images/cameraheart-icon.svg"
                  alt="Camera Icon"
                />
                <h2 className="page-title">Snappily Collected Moments</h2>
                <GalleryGrid refreshTrigger={refreshTrigger} />
              </div>
            </Page>
          </div>

          <div className="page">
            <Page number={submissions.length + 3}>
              <div className="page-content">
                <img
                  className="thankful-icon"
                  src="/images/thankful-icon.svg"
                  alt="Thankful Icon"
                />
                <h2 className="page-title">Snappily Ever After</h2>
                <p className="closing-paragraph">
                  And just like that, our adventure begins!
                </p>
                <p className="closing-paragraph">
                  Thank you for making our day unforgettable – for the laughter, the love, and the questionable dance moves!
                </p>
                <p className="closing-paragraph">
                  This book is filled with all the memories you helped create.
                </p>
                <p className="closing-paragraph italic">
                  Here's to many more chapters together!
                </p>
              </div>
            </Page>
          </div>

          <div className="page">
            <div className="back-cover">
              <img src="/images/cat_wedding.png" alt="Wedding cats" />
              <p>With love</p>
              <h2>Katie & Alex</h2>
            </div>
          </div>
        </HTMLFlipBook>

        {isAuthenticated && (
          <div className="navigation-buttons">
            <button
              className="nav-button"
              onClick={prevPage}
              disabled={page === 0}
              data-direction="prev"
            >
              <span>← Previous Page</span>
            </button>
            <button
              className="nav-button"
              onClick={nextPage}
              disabled={page === totalPages - 1}
              data-direction="next"
            >
              <span>Next Page →</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Book;
