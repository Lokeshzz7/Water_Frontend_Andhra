import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

const FilterDropdown = () => {
  // Retrieve the selected state and year from localStorage if available
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('selectedState') ? parseInt(localStorage.getItem('selectedState')) : null;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return localStorage.getItem('selectedYear') ? parseInt(localStorage.getItem('selectedYear')) : null;
  });

  // Updated states array with id, name, and value properties
  const states = [
    { id: "IN-AP", name: "Andhra Pradesh", value: 16 },
    { id: "IN-AR", name: "Arunachal Pradesh", value: 2 },
     { id: "IN-AS", name: "Assam", value: 3 },
     { id: "IN-BR", name: "Bihar", value: 4 },
     { id: "IN-CT", name: "Chhattisgarh", value: 5 },
     { id: "IN-GA", name: "Goa", value: 6 },
     { id: "IN-GJ", name: "Gujarat", value: 7 },
     { id: "IN-HR", name: "Haryana", value: 8 },
     { id: "IN-HP", name: "Himachal Pradesh", value: 9 },
     { id: "IN-JH", name: "Jharkhand", value: 10 },
     { id: "IN-KA", name: "Karnataka", value: 11 },
     { id: "IN-KL", name: "Kerala", value: 12 },
     { id: "IN-MP", name: "Madhya Pradesh", value: 13 },
     { id: "IN-MH", name: "Maharashtra", value: 14 },
     { id: "IN-MN", name: "Manipur", value: 15 },
     { id: "IN-ML", name: "Meghalaya", value: 16 },
     { id: "IN-MZ", name: "Mizoram", value: 17 },
     { id: "IN-NL", name: "Nagaland", value: 18 },
     { id: "IN-OR", name: "Odisha", value: 19 },
     { id: "IN-PB", name: "Punjab", value: 20 },
     { id: "IN-RJ", name: "Rajasthan", value: 21 },
     { id: "IN-SK", name: "Sikkim", value: 22 },
     { id: "IN-TN", name: "Tamil Nadu", value: 23 },
     { id: "IN-TG", name: "Telangana", value: 24 },
     { id: "IN-TR", name: "Tripura", value: 25 },
     { id: "IN-UP", name: "Uttar Pradesh", value: 26 },
     { id: "IN-UT", name: "Uttarakhand", value: 27 },
    { id: "IN-WB", name: "West Bengal", value: 28 },
  ];

  const years = Array.from({ length: 16 }).map((_, i) => ({
    label: `Year ${2029 - i}`,
    value: 2029 - i,
  }));

  const handleStateChange = (stateValue) => {
    setSelectedState(stateValue);
    const state = states.find((s) => s.value === stateValue);

    if (state) {
      localStorage.setItem('selectedState', stateValue);
      localStorage.setItem('StateMapId', state.id);
    }

    // Trigger storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  const handleYearChange = (yearValue) => {
    setSelectedYear(yearValue);
    localStorage.setItem('selectedYear', yearValue);
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-wrap gap-10  w-full  tracking-tight leading-none text-red-900 whitespace-nowrap max-w-full">
        <section className="filter-dropdown-container ">

          <Dropdown
            value={selectedState}
            onChange={(e) => handleStateChange(e.value)}
            options={states.map((state) => ({ label: state.name, value: state.value }))}
            placeholder="Select State"
            className="dropdown-style ml-8 mr-8 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/2 text-red-900   "
          />


          {/* <Dropdown
            value={selectedYear}
            onChange={(e) => handleYearChange(e.value)}
            options={years}
            placeholder="Select Year"
            className="dropdown-style rounded-xl p-3 font-bold text-4xl  bg-slate-100 w-1/2 "
          /> */}

          {/* <div className="c-button c-button--gooey">
              <Dropdown
                value={selectedState}
                onChange={(e) => handleStateChange(e.value)}
                options={states.map((state) => ({ label: state.name, value: state.value }))}
                placeholder="Select State"
                className="dropdown-style"
              />
              <span className="c-button__blobs">
                <div></div><div></div><div></div>
              </span>
            </div>

            <div className="c-button c-button--gooey">
              <Dropdown
                value={selectedYear}
                onChange={(e) => handleYearChange(e.value)}
                options={years}
                placeholder="Select Year"
                className="dropdown-style"
              />
              <span className="c-button__blobs">
                <div></div><div></div><div></div>
              </span>
            </div> */}

        </section>
      </section>
    </div>
  );
};

export default FilterDropdown;