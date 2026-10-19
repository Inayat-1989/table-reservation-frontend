import { useLayoutEffect, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { smoothScrollTo } from "../../utils/smoothScroll";
const SECTION_IDS = [
  "hero",
  "about",
  "menu",
  "chefs",
  "book-a-table",
  "gallery",
  "contact",
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReservationsPage = location.pathname === "/my-reservations";
  const sectionLink = (id) => `/#${id}`;

  const [activeSection, setActiveSection] = useState("hero");

  useLayoutEffect(() => {
    if (location.pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection("");
      return;
    }

    const sectionId = location.state?.scrollTo || location.hash.slice(1);

    if (!sectionId) {
      window.scrollTo(0, 0);
      setActiveSection("hero");
      return;
    }

    let frameId;
    let attempts = 0;
    let cancelled = false;

    const findTargetAndScroll = () => {
      if (cancelled) return;

      const target = document.getElementById(sectionId);

      if (!target && attempts < 20) {
        attempts += 1;
        frameId = requestAnimationFrame(findTargetAndScroll);
        return;
      }

      if (!target) {
        console.error(`Navigation target not found: #${sectionId}`);
        return;
      }

      const headerHeight = document.getElementById("header")?.offsetHeight ?? 0;

      smoothScrollTo(target, headerHeight, 900);
      setActiveSection(sectionId);
    };

    frameId = requestAnimationFrame(findTargetAndScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [location.key, location.pathname, location.hash, location.state]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const updateActiveSection = () => {
      const offset =
        (document.getElementById("header")?.offsetHeight ?? 0) + 20;
      let current = "hero";

      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);

        if (section && section.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname]);

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate("/", {
        state: { scrollTo: sectionId },
        preventScrollReset: true,
      });

      return;
    }
    const target = document.getElementById(sectionId);

    if (!target) {
      console.error(`Navigation target not found: #${sectionId}`);
      return;
    }

    const headerHeight = document.getElementById("header")?.offsetHeight ?? 0;

    smoothScrollTo(target, headerHeight, 900);

    setActiveSection(sectionId);
  };

  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <Link
          to="/"
          className="logo d-flex align-items-center me-auto me-xl-0"
          onClick={(event) => handleSectionClick(event, "hero")}
        >
          <h1 className="sitename">Yummy</h1>
          <span>.</span>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <a
                href={sectionLink("hero")}
                className={
                  activeSection === "hero" && !isReservationsPage
                    ? "active"
                    : ""
                }
                aria-current={
                  activeSection === "hero" && !isReservationsPage
                    ? "location"
                    : undefined
                }
                onClick={(event) => handleSectionClick(event, "hero")}
              >
                Home
              </a>
            </li>

            <li>
              <a
                href={sectionLink("about")}
                className={activeSection === "about" ? "active" : ""}
                aria-current={
                  activeSection === "about" ? "location" : undefined
                }
                onClick={(event) => handleSectionClick(event, "about")}
              >
                About
              </a>
            </li>

            <li>
              <a
                href={sectionLink("menu")}
                className={activeSection === "menu" ? "active" : ""}
                aria-current={activeSection === "menu" ? "location" : undefined}
                onClick={(event) => handleSectionClick(event, "menu")}
              >
                Menu
              </a>
            </li>

            <li>
              <a
                href={sectionLink("chefs")}
                className={activeSection === "chefs" ? "active" : ""}
                aria-current={
                  activeSection === "chefs" ? "location" : undefined
                }
                onClick={(event) => handleSectionClick(event, "chefs")}
              >
                Chefs
              </a>
            </li>

            <li>
              <a
                href={sectionLink("gallery")}
                className={activeSection === "gallery" ? "active" : ""}
                aria-current={
                  activeSection === "gallery" ? "location" : undefined
                }
                onClick={(event) => handleSectionClick(event, "gallery")}
              >
                Gallery
              </a>
            </li>

            <li>
              <a
                href={sectionLink("contact")}
                className={activeSection === "contact" ? "active" : ""}
                aria-current={
                  activeSection === "contact" ? "location" : undefined
                }
                onClick={(event) => handleSectionClick(event, "contact")}
              >
                Contact
              </a>
            </li>

            <li>
              <Link
                to="/my-reservations"
                className={isReservationsPage ? "active" : ""}
                aria-current={isReservationsPage ? "page" : undefined}
              >
                My Reservations
              </Link>
            </li>
          </ul>

          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

        <a
          href={sectionLink("book-a-table")}
          className="btn-getstarted"
          onClick={(event) => handleSectionClick(event, "book-a-table")}
        >
          Book a Table
        </a>
      </div>
    </header>
  );
}

export default Header;
