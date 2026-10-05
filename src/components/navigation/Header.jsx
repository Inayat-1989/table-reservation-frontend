import { Link } from "react-router-dom";

function Header() {
    return (
        <header
            id="header"
            className="header d-flex align-items-center sticky-top"
        >
            <div className="container position-relative d-flex align-items-center justify-content-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="logo d-flex align-items-center me-auto me-xl-0"
                >
                    <h1 className="sitename">Yummy</h1>
                    <span>.</span>
                </Link>

                {/* Navigation Menu */}
                <nav
                    id="navmenu"
                    className="navmenu"
                >
                    <ul>
                        <li>
                            <a
                                href="/#hero"
                                className="active"
                            >
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="/#about">
                                About
                            </a>
                        </li>

                        <li>
                            <a href="/#menu">
                                Menu
                            </a>
                        </li>

                        <li>
                            <a href="/#events">
                                Events
                            </a>
                        </li>

                        <li>
                            <a href="/#chefs">
                                Chefs
                            </a>
                        </li>

                        <li>
                            <a href="/#gallery">
                                Gallery
                            </a>
                        </li>

                        <li>
                            <a href="/#contact">
                                Contact
                            </a>
                        </li>

                        {/* My Reservations */}
                        <li>
                            <Link to="/my-reservations">
                                My Reservations
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Navigation Toggle */}
                    <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                </nav>

                {/* Book a Table */}
                <Link
                    to="/#book-a-table"
                    className="btn-getstarted"
                >
                    Book a Table
                </Link>
            </div>
        </header>
    );
}

export default Header;