import { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const Header = ({ className = "" }) => {
  

  return (
    <header className={`relative w-full py-2 box-border ${className} mq450:mb-5`}>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto font-dm-sans font-bold">
        {/* DashBoard Title */}
        <div className="absolute left-0 ml-8 text-white text-1xl">
          <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text text-[30px]">DashBoard</span>
        </div>
        {/* Greeting */}
        <div className="flex-1 text-center text-white text-[25px] hidden lg:block">
          <span>Hello </span>
        </div>
        {/* Log Out Button */}
        
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
