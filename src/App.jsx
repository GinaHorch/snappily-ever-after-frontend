import Book from './components/Book'
import styled from 'styled-components'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <AppContainer>
      <Book />
    </AppContainer>
  )
}

export default App
