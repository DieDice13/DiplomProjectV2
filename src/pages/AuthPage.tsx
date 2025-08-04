import AuthWrapper from '../components/Auth/AuthWrapper';
import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

const AuthPage = () => {
  return (
    <>
      <Header />
      <Container>
        <AuthWrapper />
      </Container>
      <Footer />
    </>
  );
};

export default AuthPage;
