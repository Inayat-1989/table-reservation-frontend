import heroImg from "../../assets/img/hero-img.png";

function Hero() {
  return (
    <section
      id="hero"
      className="hero section light-background"
      style={{ minHeight: "500px" }}
    >
      <div className="container">
        <div className="row gy-4 justify-content-center justify-content-lg-between">
          <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
            <h1>
              Enjoy Your Healthy
              <br />
              Delicious Food
            </h1>

            <p>
              We are a team of talented designers making websites with
              Bootstrap.
            </p>

            <div className="d-flex">
              <a href="#book-a-table" className="btn-get-started">
                Book a Table
              </a>
            </div>
          </div>

          <div className="col-lg-5 order-1 order-lg-2 hero-img">
            <img
              src={heroImg}
              className="img-fluid animated"
              alt="Delicious food"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
