import HTMLFlipBook from "react-pageflip";
import "./Book.css";

const Page = ({ number, children }) => {
  return (
    <div class="PageContainer">
      {children}
      <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
        {number}
      </div>
    </div>
  );
};

const Book = () => {
  return (
    <div class="BookContainer">
      {/* <HTMLFlipBook
        width={550}
        height={400}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="demo-book" */}
      {/* Cover */}
      <div className="PageContainer" number="">
        <h1>Katie's Wedding</h1>
        <p>Guest Book & Photo Album</p>
      </div>
      {/* Inside pages */}
      <Page number="1">
        <h2>Welcome to Our Wedding</h2>
        <p>Share your messages and photos with us</p>
      </Page>
      <Page number="2">
        <h2>Photo Gallery</h2>
        <p>Your memories will appear here</p>
      </Page>
      <Page number="3">
        <h2>Guest Messages</h2>
        <p>Your wishes will appear here</p>
      </Page>
      {/* Back cover */}
      <Page number="">
        <h2>Thank You</h2>
        <p>For being part of our special day</p>
      </Page>
      {/* </HTMLFlipBook> */}
    </div>
  );
};

export default Book;
