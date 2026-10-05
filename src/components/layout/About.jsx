import about1 from "../../assets/img/about-2.jpg";
import about2 from "../../assets/img/about.jpg";
function About() {
  return (
    <section id="about" className="about section">
      {/* Section Title */}
      <div className="container section-title">
        <h2>
          About Us
          <br />
        </h2>

        <p>
          <span>Learn More</span>{" "}
          <span className="description-title">About Us</span>
        </p>
      </div>

      {/* About Content */}
      <div className="container">
        <div className="row gy-4">
          {/* Left Column */}
          <div className="col-lg-7">
            <img src={about1} className="img-fluid mb-4" alt="About us" />

            <div className="book-a-table">
              <h3>Book a Table</h3>
              <p>+92 313 8393 061</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-5">
            <div className="content ps-0 ps-lg-5">
              <p className="fst-italic">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <ul>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </span>
                </li>

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>
                    Duis aute irure dolor in reprehenderit in voluptate velit.
                  </span>
                </li>

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>
                    Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate trideta
                    storacalaperda mastiro dolore eu fugiat nulla pariatur.
                  </span>
                </li>
              </ul>

              <p>
                Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>

              {/* Video */}
              <div className="position-relative mt-4">
                <img
                  src={about2}
                  className="img-fluid"
                  alt="About our restaurant"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
