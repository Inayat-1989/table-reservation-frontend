import chef1 from "../../assets/img/chefs/chefs-1.jpg";
import chef2 from "../../assets/img/chefs/chefs-2.jpg";
import chef3 from "../../assets/img/chefs/chefs-3.jpg";

const Chefs = () => {
  const chefs = [
    {
      id: 1,
      image: chef1,
      name: "Walter White",
      role: "Master Chef",
      description:
        "Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enim corporis et voluptate.",
    },
    {
      id: 2,
      image: chef2,
      name: "Sarah Jhonson",
      role: "Patissier",
      description:
        "Quo esse repellendus quia id. Est eum et accusantium pariatur fugit nihil minima suscipit corporis. Voluptate sed quas reiciendis animi neque sapiente.",
    },
    {
      id: 3,
      image: chef3,
      name: "William Anderson",
      role: "Cook",
      description:
        "Vero omnis enim consequatur. Voluptas consectetur unde qui molestiae deserunt. Voluptates enim aut architecto porro aspernatur molestiae modi.",
    },
  ];

  return (
    <section id="chefs" className="chefs section">
      {/* Section Title */}
      <div className="container section-title">
        <h2>chefs</h2>

        <p>
          <span>Our</span>{" "}
          <span className="description-title">
            Proffesional Chefs
            <br />
          </span>
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {chefs.map((chef) => (
            <div className="col-lg-4 d-flex align-items-stretch" key={chef.id}>
              <div className="team-member">
                <div className="member-img">
                  <img src={chef.image} className="img-fluid" alt={chef.name} />

                  <div className="social">
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>

                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>

                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>

                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>

                <div className="member-info">
                  <h4>{chef.name}</h4>

                  <span>{chef.role}</span>

                  <p>{chef.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chefs;
