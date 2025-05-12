import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // from context
    setIsOpen(false);
  };

  // Basic mobile check using a breakpoint (~1024px for lg)
  const isMobile = window.innerWidth < 1024;
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const projectDocClickable = !isAuthenticated && (isLandingPage || isLoginPage);

  // Updated theme-dependent colors with toned-down accents:
const brandColor = "text-sky-900";
const navLinkColor = "text-sky-900";
const navLinkHover = "hover:text-sky-600";
const mobileIconColor = "text-sky-900";
const mobileIconHover = "hover:text-sky-600";
const signOutColor = "text-sky-900";
const signOutHover = "hover:text-sky-600";
const navBgClass = "bg-gray-100"; // or "bg-white"
const signUpBtnClass = "bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2 rounded-lg";


  // // New button class for the Sign Up button in light/dark mode:
  // const signUpBtnClass = theme === "dark"
  //   ? "btn bg-yellow-600 hover:bg-yellow-500 text-gray-900 border-0 shadow-none px-4 py-2"
  //   : "btn bg-yellow-500 hover:bg-yellow-400 hover:text-gray-900 text-gray-100 border-0 shadow-none px-4 py-2";

  // // Updated navbar background based on theme:
  // const navBgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  return (
    <nav className={`navbar ${navBgClass} shadow-sm px-4 md:px-6 fixed top-0 left-0 w-full z-50`}>
      {/* Navbar Start – Logo and ProjectDoc */}
      <div className="navbar-start flex items-center space-x-2">
        {/* <img src={logo} alt="Logo" className="h-8 w-8" /> */}
        {projectDocClickable ? (
          <Link to="/" className={`text-xl font-bold ${brandColor}`}>
            ATSE ASSESSMENT 3
          </Link>
        ) : (
          <span className={`text-xl font-bold ${brandColor} cursor-default`}>
            ATSE ASSESSMENT 3
          </span>
        )}
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {isMobile ? (
          // On mobile, always show the drawer icon.
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`btn btn-ghost focus:outline-none shadow-none border-0 ${mobileIconColor} ${mobileIconHover} hover:bg-transparent active:outline-none focus:ring-0`}
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v.01M12 12v.01M12 18v.01" />
            </svg>
          </button>
        ) : (
          // On web view:
          isLoginPage ? (
            // On the Login page, do not show any drawer icon.
            null
          ) : !isAuthenticated && isLandingPage ? (
            // When logged out on Landing, show the Sign Up button.
            <Link to="/login" className={signUpBtnClass}>
              Sign Up
            </Link>
          ) : (
            // Otherwise, show the drawer icon.
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`btn btn-ghost focus:outline-none shadow-none border-0 ${mobileIconColor} ${mobileIconHover} hover:bg-transparent active:outline-none focus:ring-0`}
              aria-label="Open Menu"
            >
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                viewBox="0 0 6 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.21698 12C5.21698 12.6917 4.94221 13.355 4.45311 13.8441C3.96402 14.3332 3.30066 14.608 2.60898 14.608C1.91729 14.608 1.25394 14.3332 0.764842 13.8441C0.275747 13.355 0.000976563 12.6917 0.000976562 12C0.000976562 11.3083 0.275747 10.645 0.764842 10.1559C1.25394 9.66677 1.91729 9.392 2.60898 9.392C3.30066 9.392 3.96402 9.66677 4.45311 10.1559C4.94221 10.645 5.21698 11.3083 5.21698 12ZM5.21698 2.608C5.21698 3.29968 4.94221 3.96304 4.45311 4.45213C3.96402 4.94123 3.30066 5.216 2.60898 5.216C1.91729 5.216 1.25394 4.94123 0.764842 4.45213C0.275747 3.96304 0.000976563 3.29968 0.000976562 2.608C0.000976562 1.91632 0.275747 1.25296 0.764842 0.763866C1.25394 0.274771 1.91729 0 2.60898 0C3.30066 0 3.96402 0.274771 4.45311 0.763866C4.94221 1.25296 5.21698 1.91632 5.21698 2.608ZM5.21698 21.391C5.21698 22.0827 4.94221 22.746 4.45311 23.2351C3.96402 23.7242 3.30066 23.999 2.60898 23.999C1.91729 23.999 1.25394 23.7242 0.764842 23.2351C0.275747 22.746 0.000976563 22.0827 0.000976562 21.391C0.000976562 20.6993 0.275747 20.036 0.764842 19.5469C1.25394 19.0578 1.91729 18.783 2.60898 18.783C3.30066 18.783 3.96402 19.0578 4.45311 19.5469C4.94221 20.036 5.21698 20.6993 5.21698 21.391Z" fill="currentColor"/>
              </svg>
            </button>
          )
        )}
      </div>

      {/* Drawer with Overlay for Click-Outside-to-Close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div
            className={`fixed right-4 top-16 ${navBgClass} shadow-md rounded-lg w-48 z-50 p-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {!isAuthenticated ? (
              <ul className="menu menu-vertical space-y-2">
                {isMobile && (
                  <li>
                    <Link
                      to="/"
                      className={`${navLinkColor} ${navLinkHover} cursor-pointer`}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                )}
                {!isLoginPage && (
                  <li>
                    <Link
                      to="/login"
                      className={`${navLinkColor} ${navLinkHover} cursor-pointer`}
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <>
                {isMobile && (
                  <ul className="menu menu-vertical space-y-2">
                    <li>
                      <Link
                        to="/dashboard"
                        className={`${navLinkColor} ${navLinkHover} cursor-pointer`}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                )}
              </>
            )}

            {isAuthenticated && (
              // For logged-in users: render Sign Out button.
              isMobile ? (
                <div className="border-t mt-3 pt-3">
                  <button
                    className={`${signOutColor} ${signOutHover} w-full text-left cursor-pointer`}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>

                  <button
                  className={`${signOutColor} ${signOutHover} w-full text-left cursor-pointer pt-3`}
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                >
                 Dashboard
                </button>
                </div>
              ) : (
                <div>
                <button
                  className={`${signOutColor} ${signOutHover} w-full text-left cursor-pointer`}
                  onClick={handleLogout}
                >
                  Sign Out
                </button>

                <button
                  className={`${signOutColor} ${signOutHover} w-full text-left cursor-pointer pt-3`}
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                >
                 Dashboard
                </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
