import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import PopularBrands from '../components/PopularBrands/PopularBrands';
import ProductSliderContainer from '../components/ProductSlider/ProductSliderContainer';
import PromoSlider from '../components/PromoSlider/PromoSlider';
import ShowCase from '../components/ShowCase/ShowCase';

const Home = () => {
  return (
    <>
      <Header />
      <Container>
        <ShowCase />
        <ProductSliderContainer category="smartphones" />
        <PromoSlider />
        <ProductSliderContainer category="gaming_devices" />
        <ProductSliderContainer category="laptops" />
        <PromoSlider />
        <PopularBrands />
      </Container>
      <Footer />
    </>
  );
};

export default Home;
