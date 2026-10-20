
import { useLayoutEffect, useEffect, useState, useRef } from "react";
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

const LAYOUT_QUIET_TIME = 350;
const MAX_LAYOUT_WAIT = 5000;
const SCROLL_DURATION = 900;

function waitForPageLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timeout = window.setTimeout(finish, 3000);

    function finish() {
      window.clearTimeout(timeout);
      window.removeEventListener("load", finish);
      resolve();
    }

    window.addEventListener("load", finish, { once: true });
  });
}

async function waitForStableLayout() {
  await waitForPageLoad();

  // Wait for web fonts when available, but do not wait indefinitely.
  if (document.fonts?.ready) {
    await Promise.race([
      document.fonts.ready.catch(() => {}),
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);
  }

  await new Promise((resolve) => {
    let quietTimer;
    let maxWaitTimer;
    let observer;

    const finish = () => {
      window.clearTimeout(quietTimer);
      window.clearTimeout(maxWaitTimer);
      observer?.disconnect();
      resolve();
    };

    const resetQuietTimer = () => {
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(
        finish,
        LAYOUT_QUIET_TIME
      );
    };

    if ("ResizeObserver" in window && document.body) {
      observer = new ResizeObserver(resetQuietTimer);

      observer.observe(document.documentElement);
      observer.observe(document.body);
    }

    maxWaitTimer = window.setTimeout(
      finish,
      MAX_LAYOUT_WAIT
    );

    // Require a quiet layout period before calculating the target.
    resetQuietTimer();
  });
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollingToRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const isReservationsPage =
    location.pathname === "/my-reservations";

  const sectionLink = (id) => `/#${id}`;

  const [activeSection, setActiveSection] = useState("hero");

  function clearScrollLock() {
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }

  function lockScrollTo(sectionId) {
    clearScrollLock();

    scrollingToRef.current = sectionId;

    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollingToRef.current = null;
      scrollTimeoutRef.current = null;
    }, SCROLL_DURATION + 150);
  }

  function saveSectionInUrl(sectionId) {
    const nextUrl = `/#${sectionId}`;

    if (
      window.location.pathname !== "/" ||
      window.location.hash !== `#${sectionId}`
    ) {
      window.history.replaceState(
        window.history.state,
        "",
        nextUrl
      );
    }
  }

  useLayoutEffect(() => {
    // Prevent the browser from restoring an unrelated scroll position.
    window.history.scrollRestoration = "manual";

    if (location.pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection("");
      scrollingToRef.current = null;
      clearScrollLock();
      return;
    }

    // Prefer the URL hash because it survives a browser refresh.
    const requestedSection =
      location.hash.slice(1) ||
      location.state?.scrollTo ||
      "hero";

    const sectionId = SECTION_IDS.includes(requestedSection)
      ? requestedSection
      : "hero";

    let cancelled = false;
    let frameId = null;

    // Stop active-section tracking from reacting to the old position
    // while we wait for the page layout to settle.
    lockScrollTo(sectionId);

    const findTargetAndScroll = async () => {
      await waitForStableLayout();

      if (cancelled) return;

      let target = document.getElementById(sectionId);
      let attempts = 0;

      // Allow React-rendered content another short opportunity to mount.
      while (!target && attempts < 20 && !cancelled) {
        await new Promise((resolve) => {
          frameId = window.requestAnimationFrame(resolve);
        });

        target = document.getElementById(sectionId);
        attempts += 1;
      }

      if (cancelled) return;

      if (!target) {
        scrollingToRef.current = null;
        console.error(
          `Navigation target not found: #${sectionId}`
        );
        return;
      }

      // Recalculate the header height immediately before scrolling.
      const headerHeight =
        document.getElementById("header")?.offsetHeight ?? 0;

      // Keep the URL and the intended destination synchronized.
      saveSectionInUrl(sectionId);

      smoothScrollTo(
        target,
        headerHeight,
        SCROLL_DURATION
      );

      setActiveSection(sectionId);

      clearScrollLock();

      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingToRef.current = null;
        scrollTimeoutRef.current = null;
      }, SCROLL_DURATION + 150);
    };

    findTargetAndScroll();

    return () => {
      cancelled = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      clearScrollLock();
    };
  }, [
    location.key,
    location.pathname,
    location.hash,
    location.state,
  ]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const updateActiveSection = () => {
      // Do not let scroll tracking override an intended navigation.
      if (scrollingToRef.current !== null) return;

      const headerHeight =
        document.getElementById("header")?.offsetHeight ?? 0;

      const offset = headerHeight + 20;
      let current = "hero";

      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);

        if (
          section &&
          section.getBoundingClientRect().top <= offset
        ) {
          current = id;
        }
      }

      setActiveSection(current);

      // Preserve the visible section for a future refresh.
      saveSectionInUrl(current);
    };

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    // Re-evaluate after layout changes, such as a map loading.
    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(updateActiveSection)
        : null;

    if (resizeObserver && document.body) {
      resizeObserver.observe(document.body);
      resizeObserver.observe(document.documentElement);
    }

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      resizeObserver?.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      clearScrollLock();
    };
  }, []);

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();

    if (!SECTION_IDS.includes(sectionId)) return;

    lockScrollTo(sectionId);
    setActiveSection(sectionId);

    if (location.pathname !== "/") {
      navigate("/", {
        state: { scrollTo: sectionId },
        preventScrollReset: true,
      });

      return;
    }

    const target = document.getElementById(sectionId);

    if (!target) {
      scrollingToRef.current = null;

      console.error(
        `Navigation target not found: #${sectionId}`
      );

      return;
    }

    saveSectionInUrl(sectionId);

    const headerHeight =
      document.getElementById("header")?.offsetHeight ?? 0;

    smoothScrollTo(
      target,
      headerHeight,
      SCROLL_DURATION
    );

    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollingToRef.current = null;
      scrollTimeoutRef.current = null;
    }, SCROLL_DURATION + 150);
  };

  return (
    <header
      id="header"
      className="header d-flex align-items-center sticky-top"
    >
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <Link
          to="/"
          className="logo d-flex align-items-center me-auto me-xl-0"
          onClick={(event) =>
            handleSectionClick(event, "hero")
          }
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
                onClick={(event) =>
                  handleSectionClick(event, "hero")
                }
              >
                Home
              </a>
            </li>

            <li>
              <a
                href={sectionLink("about")}
                className={
                  activeSection === "about" ? "active" : ""
                }
                aria-current={
                  activeSection === "about"
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleSectionClick(event, "about")
                }
              >
                About
              </a>
            </li>

            <li>
              <a
                href={sectionLink("menu")}
                className={
                  activeSection === "menu" ? "active" : ""
                }
                aria-current={
                  activeSection === "menu"
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleSectionClick(event, "menu")
                }
              >
                Menu
              </a>
            </li>

            <li>
              <a
                href={sectionLink("chefs")}
                className={
                  activeSection === "chefs" ? "active" : ""
                }
                aria-current={
                  activeSection === "chefs"
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleSectionClick(event, "chefs")
                }
              >
                Chefs
              </a>
            </li>

            <li>
              <a
                href={sectionLink("gallery")}
                className={
                  activeSection === "gallery" ? "active" : ""
                }
                aria-current={
                  activeSection === "gallery"
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleSectionClick(event, "gallery")
                }
              >
                Gallery
              </a>
            </li>

            <li>
              <a
                href={sectionLink("contact")}
                className={
                  activeSection === "contact" ? "active" : ""
                }
                aria-current={
                  activeSection === "contact"
                    ? "location"
                    : undefined
                }
                onClick={(event) =>
                  handleSectionClick(event, "contact")
                }
              >
                Contact
              </a>
            </li>

            <li>
              <Link
                to="/my-reservations"
                className={
                  isReservationsPage ? "active" : ""
                }
                aria-current={
                  isReservationsPage ? "page" : undefined
                }
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
          onClick={(event) =>
            handleSectionClick(event, "book-a-table")
          }
        >
          Book a Table
        </a>
      </div>
    </header>
  );
}

export default Header;
