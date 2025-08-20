import Contacts from './Contacts';
import Socials from './Socials';
import FooterMenu from './FooterMenu';
import Payments from './Payments';
import Container from '../Container/Container';

function Footer() {
  return (
    <footer className="bg-[#f5f5f6] text-sm">
      <Container>
        <div className="flex justify-between pt-10 max-[1110px]:flex-col max-[1110px]:gap-12">
          <div>
            <Contacts />
            <Socials />
          </div>
          <FooterMenu />
        </div>
      </Container>

      <div className="bg-[#eaeaea] py-5 mt-5">
        <Container>
          <div className="flex justify-between items-center flex-wrap gap-3 max-[796px]:justify-center max-[796px]:gap-5 text-center">
            <p className="text-gray-700">
              © 2020 Любое использование контента без письменного разрешения запрещено
            </p>
            <Payments />
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
