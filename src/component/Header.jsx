import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import  LanguageSwitcher  from "./LanguageSwitcher.jsx";
import { useEffect  } from "react";

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
    <header className={`relative w-full ${className} m-8`}>
      <div
        className="flex items-center justify-between w-[1600px]  font-dm-sans font-bold bg-component rounded-full px-6 shadow-md"
        style={{ minHeight: "80px" }}
      >
        {/* Dashboard Title */}


        <div className="absolute left-0 ml-8 text-white text-1xl">
          <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text text-[30px]">
            Return Zero
          </span>
        <LanguageSwitcher/>
        </div>
        {/* Current Page Name */}
        <div className="flex-1 text-center text-white text-[25px] hidden lg:block">
          <span>{currentPage}</span>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
