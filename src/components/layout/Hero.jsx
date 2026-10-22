import { useLocation, useNavigate } from 'react-router-dom';
import heroImg from '../../assets/img/hero-img.png';
import { smoothScrollTo } from '../../utils/smoothScroll';

function Hero() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookTableClick = (event) => {
    event.preventDefault();

    if (location.pathname !== '/') {
      navigate('/', {
        state: { scrollTo: 'book-a-table' },
        preventScrollReset: true,
      });

      return;
    }

    const target = document.getElementById('book-a-table');

    if (!target) {
      console.error('Navigation target not found: #book-a-table');
      return;
    }

    const headerHeight = document.getElementById('header')?.offsetHeight ?? 0;

    smoothScrollTo(target, headerHeight, 900);
  };

  return (
    <section id="hero" className="hero section light-background" style={{ minHeight: '500px' }}>
      <div className="container">
        <div className="row gy-4 justify-content-center justify-content-lg-between">
          <div className="col-lg-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
            <h1>
              Enjoy Your Healthy
              <br />
              Delicious Food
            </h1>

            <p>We are a team of talented designers making websites with Bootstrap.</p>

            <div className="d-flex">
              <a href="/#book-a-table" className="btn-get-started" onClick={handleBookTableClick}>
                Book a Table
              </a>
            </div>
          </div>

          <div className="col-lg-5 order-1 order-lg-2 hero-img">
            <img src={heroImg} className="img-fluid animated" alt="Delicious food" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
