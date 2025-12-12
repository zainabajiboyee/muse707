import './Footer.css';
import footerImage from '../assets/footer-image.jpg'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-image-container">
          <img src={footerImage} alt="NANA inspired decoration" className="footer-image" />
        </div>
        
        <div className="footer-text">
          <p className="footer-main">Muse707 🍓 For the best music</p> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;