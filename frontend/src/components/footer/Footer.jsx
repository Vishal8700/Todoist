import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">
          © {currentYear} TaskMaster. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Help</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;