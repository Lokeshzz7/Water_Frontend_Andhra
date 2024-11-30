import React, { useState } from "react";
import Selection_Dropdown from './component/Risk_Selection_Dropdown';
import ReservoirMainContent from "./component/ReservoirMainContent";
import FilterDropdown from "./component/FilterDropdown";
import DistrictReservoirDropdown from "./component/DistrictReservoirDropdown.jsx"
import Test from "./test.jsx";

const ReservoirStatus = () => {
  return (
    <div className="flex overflow-hidden flex-col   py-9 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue max-md:px-5">
      <div  className="flex flex-row gap-19">      
        <FilterDropdown />
        {/*<DistrictReservoirDropdown />*/}
      </div>


      {/* <Selection_Dropdown /> */}
      {/* <Test /> */}

      <ReservoirMainContent />
    </div>
  );
};

export default ReservoirStatus;