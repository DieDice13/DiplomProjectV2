import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Favorites from '../features/favorites/Favorites';

const FavoritesPage = () => {
  return (
    <div>
      <>
        <Header />
        <Container>
          <Favorites />
        </Container>
        <Footer />
      </>
    </div>
  );
};

export default FavoritesPage;
