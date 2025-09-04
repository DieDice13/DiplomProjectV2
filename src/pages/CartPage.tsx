import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Cart from '../features/cart/Cart';
import Header from '../components/Header/Header';
import ProductSliderContainer from '../components/ProductSlider/ProductSliderContainer';

const CartPage = () => {
  return (
    <>
      <Header />
      <Container>
        <Cart />
        <ProductSliderContainer category="smartphones" />
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
