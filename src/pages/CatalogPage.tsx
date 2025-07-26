import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Catalog from '../features/catalog/Catalog';

const CatalogPage = () => {
  return (
    <>
      <Header />
      <Container>
        <Catalog />
      </Container>
      <Footer />
    </>
  );
};

export default CatalogPage;
