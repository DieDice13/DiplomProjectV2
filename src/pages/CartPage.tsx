import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Cart from '../features/cart/Cart';
import Header from '../components/Header/Header';

const CartPage = () => {
  return (
    <>
      <Header />
      <Container>
        <Cart />
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
