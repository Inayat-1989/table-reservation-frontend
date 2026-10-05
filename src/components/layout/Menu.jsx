import { useState } from "react";
import { menuItemsData, CATEGORIES } from '../../services/menu-items'

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItemsData
      : menuItemsData.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="menu section">
      {/* Section Title */}
      <div className="container section-title">
        <h2>Our Menu</h2>
        <p>
          <span>Check Our</span>{" "}
          <span className="description-title">Yummy Menu</span>
        </p>
      </div>

      <div className="container">
        {/* Category Tabs */}
        <ul className="nav nav-tabs d-flex justify-content-center">
          {CATEGORIES.map((category) => (
            <li className="nav-item" key={category.id}>
              <button
                type="button"
                className={`nav-link ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Menu Content */}
        <div className="tab-content">
          <div className="tab-pane fade show active">
            <div className="tab-header text-center">
              <p>Menu</p>
              <h3>
                {
                  CATEGORIES.find((category) => category.id === activeCategory)
                    ?.label
                }
              </h3>
            </div>

            <div className="row gy-5">
              {filteredItems.map((item) => (
                <div className="col-lg-4 menu-item" key={item.id}>
                  <img
                    src={item.src}
                    className="menu-img img-fluid"
                    alt={item.title}
                  />

                  <h4>{item.title}</h4>

                  <p className="ingredients">{item.description}</p>

                  <p className="price">{item.price}</p>

                  {/* Optional availability / special indicators */}
                  {item.isSpecial && (
                    <span className="badge bg-warning text-dark">
                      Chef's Special
                    </span>
                  )}

                  {!item.isAvailable && (
                    <span className="badge bg-secondary">
                      Currently Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
