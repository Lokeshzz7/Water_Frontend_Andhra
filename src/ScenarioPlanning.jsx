import React from "react";
import Selection_Dropdown from "./component/Selection_Dropdown.jsx";

import MainContent from "./component/MainContent.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";

const ScenarioPlanning = () => {
  return (
    <main className="flex overflow-hidden flex-col px-8  shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue max-md:px-5">
      <FilterDropdown />
      {/* <Selection_Dropdown /> */}
      <MainContent />
    </main>
  );
};

export default ScenarioPlanning;
