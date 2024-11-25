import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

const FilterDropdown = () => {
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('selectedState') ? parseInt(localStorage.getItem('selectedState')) : null;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return localStorage.getItem('selectedYear') ? parseInt(localStorage.getItem('selectedYear')) : null;
  });

  const states = [
    { label: 'Arunachal Pradesh', value: 1 },
    { label: 'Odisha', value: 2 },
    { label: 'Manipur', value: 3 },
    { label: 'Rajasthan', value: 4 },
    { label: 'Bihar', value: 5 },
    { label: 'Telangana', value: 6 },
    { label: 'Puducherry', value: 7 },
    { label: 'Lakshadweep', value: 8 },
    { label: 'Ladakh', value: 9 },
    { label: 'Kerala', value: 10 },
    { label: 'Andaman and Nicobar Islands', value: 11 },
    { label: 'Maharashtra', value: 12 },
    { label: 'Uttar Pradesh', value: 13 },
    { label: 'Mizoram', value: 14 },
    { label: 'Uttarakhand', value: 15 },
    { label: 'Andhra Pradesh', value: 16 },
    { label: 'Haryana', value: 17 },
    { label: 'Dadra and Nagar Haveli', value: 18 },
    { label: 'Himachal Pradesh', value: 19 },
    { label: 'Karnataka', value: 20 },
    { label: 'Jammu and Kashmir', value: 21 },
    { label: 'Chhattisgarh', value: 22 },
    { label: 'Meghalaya', value: 23 },
    { label: 'Delhi', value: 24 },
    { label: 'Tripura', value: 25 },
    { label: 'West Bengal', value: 26 },
    { label: 'Assam', value: 27 },
    { label: 'Madhya Pradesh', value: 28 },
    { label: 'Nagaland', value: 29 },
    { label: 'Goa', value: 30 },
    { label: 'Daman and Diu', value: 31 },
    { label: 'Jharkhand', value: 32 },
    { label: 'Sikkim', value: 33 },
    { label: 'Tamil Nadu', value: 34 },
    { label: 'Gujarat', value: 35 },
    { label: 'Punjab', value: 36 }
  ];
  const years = Array.from({ length: 100 }).map((_, i) => ({
    label: `Year ${2044 - i}`,
    value: 2044 - i,
  }));

  const handleStateChange = (state) => {
    setSelectedState(state);
    localStorage.setItem('selectedState', state);
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  const handleYearChange = (year) => {

    setSelectedYear(year);
    localStorage.setItem('selectedYear', year);
    // Trigger storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="container mx-auto px-4">
      {/* Existing JSX without modification */}
      <section className="flex flex-wrap gap-10 justify-between items-center w-full text-2xl tracking-tight leading-none text-white whitespace-nowrap max-w-[1382px]">
        <section className="filter-dropdown-container">
          <section className="button-container gap-10">
            <div className="c-button c-button--gooey">
              <Dropdown 
                value={selectedState}
                onChange={(e) => handleStateChange(e.value)}
                options={states}
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
            </div>
          </section>
        </section>
      </section>
    </div>
  );
};

export default FilterDropdown;
