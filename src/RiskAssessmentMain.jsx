import React from 'react';
import DateFilter from './component/DateFilter';
import Risk_Selection_Dropdown from './component/Risk_Selection_Dropdown';
import FilterDropdown from './component/FilterDropdown';
import RiskAssessment from './component/Risk_text_data';
import DataVisualizations from './component/DataVisualizations';
import RiskFilter from './component/RiskFilter.jsx';

const WaterManagementDashboard = () => {

  return (
    <main className="flex overflow-hidden flex-col   py-9 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue max-md:px-5">
      {/* <FilterDropdown /> */}
      <RiskFilter />
      {/* <Risk_Selection_Dropdown /> */}
      
      <section className="mt-9 max-md:max-w-full">
        <div className="flex gap-5 h-full max-md:flex-col">
          <div className="flex flex-col w-[50%] mb-10 max-md:ml-0 max-md:w-full">
            <RiskAssessment />
          </div>
          <div className="flex flex-col  mb-20 h-full w-[50%] max-md:ml-0 max-md:w-full">
            <DataVisualizations />
          </div>
        </div>
      </section>
    </main>
  );
};

export default WaterManagementDashboard;