import AltNavbar from "../components/navigationAlt/AltNavbar";
import Show from "../../src/components/HOC/Show";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  children: React.ReactNode;
};

const AltMainLayout = ({ children }: Props) => {
  return (
    <>
      <AltNavbar />
      <main className="alt-layout__main">{children}</main>
      <Show blacklistRoutes={["/listings/[id]", "/test"]}>
        <Footer />
      </Show>
    </>
  );
};
export default AltMainLayout;

const Footer = () => {
  return (
    <footer className="flow-content">
      <div className="footer__header">
        <h1>Horizon Real Estate</h1>
        <div>
          <a href="https://web.facebook.com/horizonbienesraices22">
            <FaFacebook size={32} />
          </a>
          <a href="https://instagram.com/horizonbienesraices?igshid=YmMyMTA2M2Y=">
            <FaInstagram size={32} />
          </a>
        </div>
      </div>
      <div>
        <FaWhatsapp size={32} />
        <a href="https://wa.me/526251459646">625 145 9646</a>
      </div>
      <div>
        <AiOutlineMail size={32} />
        <a href="mailto: info@horizonrealty.com.mx">
          info@horizonrealty.com.mx
        </a>
      </div>
    </footer>
  );
};
