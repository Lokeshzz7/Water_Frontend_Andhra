import React, { useState } from "react";
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css';         // PrimeReact core
import 'primeicons/primeicons.css';
import Selection_Dropdown from './component/Selection_Dropdown.jsx'
import Reports from "./component/reports.jsx";
import DistrictDropdown from "./component/Districtdropdown.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import UploadButton from "./component/UploadButton.jsx";


function ReportsExports() {


  const items = Array.from({ length: 100000 }).map((_, i) => ({ label: `Item #${i}`, value: i }));

  return (
    <main className="flex flex-col justify-evenly items-center pt-5 bg-darkslateblue shadow-lg max-md:px-5 overflow-hidden">
      {/* <DistrictDropdown /> */}
      {/* <Selection_Dropdown /> */}
      <div className="flex flex-row justify-evenly gap-10">
      <FilterDropdown />
      </div>
      <Reports />
    </main>
  );
}

export default ReportsExports;
