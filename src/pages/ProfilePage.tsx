import Container from '../components/Container/Container';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Profile from '../components/Profile/Profile';

const ProfilePage = () => {
  return (
    <>
      <Header />
      <Container>
        <Profile />
      </Container>
      <Footer />
    </>
  );
};

export default ProfilePage;
