import ProductSliderContainer from '../components/ProductSlider/ProductSliderContainer';
import ShowCase from '../components/ShowCase/ShowCase';

const Home = () => {
  return (
    <>
      <ShowCase />
      <ProductSliderContainer category="smartphone" />
    </>
  );
};

export default Home;
