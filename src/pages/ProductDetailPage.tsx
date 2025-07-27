import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import ProductDetail from '../components/ProductDetail/ProductDetail';

const Product = () => {
  return (
    <>
      <Header />
      <Container>
        <ProductDetail />
      </Container>
      <Footer />
    </>
  );
};

export default Product;
