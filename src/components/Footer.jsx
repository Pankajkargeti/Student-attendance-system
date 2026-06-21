const APP_VERSION = "1.1.0";

function Footer() {
  return (
    <footer className="app-footer">
      <span>Attendance System v{APP_VERSION}</span>
      <span className="footer-divider">•</span>
      <span>Data is stored only in this browser (localStorage)</span>
    </footer>
  );
}

export default Footer;
