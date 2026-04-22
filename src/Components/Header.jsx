import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { useTheme } from "../Themes/ThemeContext";

// Import Logo Image
import tradenixPro from "../assets/Images/about/tradenixpro.png";

const Header = () => {
  const { dark, toggle } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Home",
    "About",
    "License and registration",
    "Buy crypto",
    "Services",
    "FAQ",
    "Contact",
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={tradenixPro}
            alt="TradeNixPro"
            className="h-10 sm:h-12 md:h-14 w-auto transition-all duration-200"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {menuItems.map((item) => {
            if (item === "Buy crypto") {
              return (
                <a
                  key={item}
                  href="https://www.blockchain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 transition-colors text-base lg:text-lg font-bold"
                >
                  {item}
                </a>
              );
            }
            return (
              <Link
                key={item}
                to={
                  item === "Home"
                    ? "/"
                    : item === "About"
                      ? "/about"
                      : item === "Services"
                        ? "/services"
                        : item === "FAQ"
                          ? "/faq"
                          : item === "Contact"
                            ? "/contact"
                            : item === "License and registration"
                              ? "/license"
                              : `/#${item.toLowerCase().replace(/\s+/g, "-")}`
                }
                className="text-white hover:text-green-400 transition-colors text-base lg:text-lg font-bold"
              >
                {item}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-gray-300 font-medium hidden sm:inline text-sm md:text-base">
                Hi, {user.username}!
              </span>
              {location.pathname !== "/dashboard" ? (
                <Link
                  to="/dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold transition text-sm md:text-base"
                >
                  Dashboard
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition text-sm md:text-base"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-5 sm:px-6 py-2.5 rounded-lg font-bold transition text-sm md:text-base"
            >
              Get Started
            </Link>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950 z-[60] overflow-y-auto">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-10">
              <Link to="/" className="flex items-center" onClick={closeMenu}>
                <img
                  src={tradenixPro}
                  alt="TradeNixPro"
                  className="h-12 w-auto"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6h12v12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col space-y-8 text-xl">
              {menuItems.map((item) => {
                if (item === "Buy crypto") {
                  return (
                    <a
                      key={item}
                      href="https://www.blockchain.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="text-gray-300 hover:text-green-400 py-3 text-lg"
                    >
                      {item}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item}
                    to={
                      item === "Home"
                        ? "/"
                        : item === "About"
                          ? "/about"
                          : item === "Services"
                            ? "/services"
                            : item === "FAQ"
                              ? "/faq"
                              : item === "Contact"
                                ? "/contact"
                                : item === "License and registration"
                                  ? "/license"
                                  : "#"
                    }
                    onClick={closeMenu}
                    className="text-gray-300 hover:text-green-400 py-3 text-lg"
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
