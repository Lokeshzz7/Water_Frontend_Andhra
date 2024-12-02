import React, { useState } from "react";
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css';         // PrimeReact core
import 'primeicons/primeicons.css';
import Selection_Dropdown from './component/Selection_Dropdown.jsx'
import Reports from "./component/reports.jsx";


function ReportsExports() {


  const items = Array.from({ length: 100000 }).map((_, i) => ({ label: `Item #${i}`, value: i }));

  return (
    <main className="flex overflow-hidden flex-col px-8  shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component max-md:px-5">
      <Selection_Dropdown />
      <Reports />
    </main>
  );
}

export default ReportsExports;
