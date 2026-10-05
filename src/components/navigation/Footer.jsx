const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container">
        <div className="row gy-3">
          {/* Address */}
          <div className="col-lg-3 col-md-6 d-flex">
            <i className="bi bi-geo-alt icon"></i>

            <div className="address">
              <h4>Address</h4>
              <p>Ramada Hotel</p>
              <p>Pinnacloid, Lahore, Pakistan</p>
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 d-flex">
            <i className="bi bi-telephone icon"></i>

            <div>
              <h4>Contact</h4>

              <p>
                <strong>Phone:</strong> <span>+92 313 8393 061</span>
                <br />
                <strong>Email:</strong> <span>info@pinnacloid.com</span>
                <br />
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="col-lg-3 col-md-6 d-flex">
            <i className="bi bi-clock icon"></i>

            <div>
              <h4>Opening Hours</h4>

              <p>
                <strong>Mon-Sat:</strong> <span>11AM - 23PM</span>
                <br />
                <strong>Sunday:</strong> <span>Closed</span>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-lg-3 col-md-6">
            <h4>Follow Us</h4>

            <div className="social-links d-flex">
              <a href="#" className="twitter">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#" className="facebook">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" className="instagram">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" className="linkedin">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container copyright text-center mt-4">
        <p>
          © <span>Copyright</span>{" "}
          <strong className="px-1 sitename">Yummy</strong>{" "}
          <span>All Rights Reserved</span>
        </p>

        <div className="credits">
          Designed by{" "}
          <a href="https://bootstrapmade.com/" target="_blank" rel="noreferrer">
            Inayat Ullah
          </a>{" "}
          Distributed by{" "}
          <a href="https://themewagon.com" target="_blank" rel="noreferrer">
            Pinnacloid
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
