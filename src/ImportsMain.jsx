import React, { useState } from "react";
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css';         // PrimeReact core
import 'primeicons/primeicons.css';
import Reports from "./component/reports.jsx";
import UploadButton from "./component/UploadButton.jsx";
import Imports from "./component/Imports.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import Exports from "./component/Exports.jsx";


const ImportsMain = () => {

  return (
    <main className="flex flex-col justify-evenly items-center pt-5 bg-darkslateblue shadow-lg max-md:px-5 overflow-hidden">
      
      <Imports/>
      <Exports />
    </main>
  );
}

export default ImportsMain;
