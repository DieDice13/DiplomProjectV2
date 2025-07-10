import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import Container from './components/Container/Container';
import Header from './components/Header/Header';

const App = () => {
  const routing = useRoutes(routes);
  return (
    <>
      <Header />
      <Container>{routing}</Container>
    </>
  );
};

export default App;
