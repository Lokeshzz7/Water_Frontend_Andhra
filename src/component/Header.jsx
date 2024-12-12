import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import logo from "../data/logo2.png"; // Imported logo
import LanguageSwitcher from "./LanguageSwitcher.jsx";
const Header = ({ className = "" }) => {
  const location = useLocation();

  // Map routes to readable names
  const pageNames = {
    "/waterforecast": "Water Forecast",
    "/reservoirstatus": "Reservoir Status",
    "/riskassessment": "Risk Assessment",
    "/scenarioplanning": "Scenario Planning",
    "/reports": "Reports & Exports",
    "/map": "Map",
  };

  // Get the current page name or a default
  const currentPage = pageNames[location.pathname] || "Dashboard";

  return (
    <header className={`relative w-full ${className} m-3`}>
      <div
        className="flex items-center justify-between font-dm-sans font-bold bg-component rounded-full px-6 shadow-md"
        style={{ minHeight: "80px" }}
      >
        {/* Logo and Dashboard Title */}
        <div className="flex items-center">
          <div className="text-white text-xl">
            <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text text-[30px]">
              Return Zero
            </span>
          </div>
          <img
            src={logo} // Use the imported logo
            alt="Logo"
            className="h-16 mr-2" // Adjust size and margin as needed
          />
        </div>

        {/* Current Page Name */}
        <div className="text-white text-center text-[20px] hidden lg:block flex-1">
          <span>{currentPage}</span>
        </div>

        {/* Right Side Buttons */}
        <div className="ml-auto flex items-center">
        {/* <LanguageSwitcher /> */}
          {/* Linktree Button */}
          <a
            href="https://www.hopp.bio/bhuvanesh24"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none"
          >
            Ref data Links
          </a>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
