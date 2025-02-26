import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #fff;
  border: 1px solid #c2c2c2;
  border-radius: 0 10px 10px 0;
  box-shadow: inset -7px 0 30px -7px rgba(0,0,0,0.4);
  height: 100%;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BookContainer = styled.div`
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Page = ({ number, children }) => {
  return (
    <PageContainer>
      {children}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        {number}
      </div>
    </PageContainer>
  );
};

const Book = () => {
  return (
    <BookContainer>
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="demo-book"
      >
        {/* Cover */}
        <Page number="">
          <h1>Katie's Wedding</h1>
          <p>Guest Book & Photo Album</p>
        </Page>

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
      </HTMLFlipBook>
    </BookContainer>
  );
};

export default Book; 