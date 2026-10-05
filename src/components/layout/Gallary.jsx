import gallery1 from "../../assets/img/gallery/gallery-1.jpg";
import gallery2 from "../../assets/img/gallery/gallery-2.jpg";
import gallery3 from "../../assets/img/gallery/gallery-3.jpg";
import gallery4 from "../../assets/img/gallery/gallery-4.jpg";
import gallery5 from "../../assets/img/gallery/gallery-5.jpg";
import gallery6 from "../../assets/img/gallery/gallery-6.jpg";
import gallery7 from "../../assets/img/gallery/gallery-7.jpg";
import gallery8 from "../../assets/img/gallery/gallery-8.jpg";

const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      image: gallery1,
    },
    {
      id: 2,
      image: gallery2,
    },
    {
      id: 3,
      image: gallery3,
    },
    {
      id: 4,
      image: gallery4,
    },
    {
      id: 5,
      image: gallery5,
    },
    {
      id: 6,
      image: gallery6,
    },
    {
      id: 7,
      image: gallery7,
    },
    {
      id: 8,
      image: gallery8,
    },
  ];

  return (
    <section id="gallery" className="gallery section light-background">
      {/* Section Title */}
      <div className="container section-title">
        <h2>Gallery</h2>

        <p>
          <span>Check</span>{" "}
          <span className="description-title">Our Gallery</span>
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {galleryImages.map((item) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
              <a
                className="glightbox"
                data-gallery="images-gallery"
                href={item.image}
              >
                <img
                  src={item.image}
                  className="img-fluid"
                  alt={`Gallery ${item.id}`}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
