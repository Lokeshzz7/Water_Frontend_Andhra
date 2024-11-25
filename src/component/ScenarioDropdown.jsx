import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import ScenarioSlider from '../graph/ScenarioSlider'; // Import the ScenarioSlider component

const ScenarioDropdown = () => {
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem('selectedOption') || null;
  });

  const options = [
    { label: 'Rainfall', value: 'rainfall' },
    { label: 'Drought', value: 'drought' },
    { label: 'Population', value: 'population' },
  ];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    localStorage.setItem('selectedOption', option);
  };

  useEffect(() => {
    console.log('Selected option from localStorage or initial state:', selectedOption);
  }, []);

  return (
    <div className="container mx-2 px-4">
      <section className="flex flex-wrap gap-10 justify-between items-center w-1/2 text-2xl tracking-tight leading-none text-black whitespace-nowrap max-w-[1382px]">
        <section className="filter-dropdown-container">
          <div className="c-button c-button--gooey">
            <Dropdown
              value={selectedOption}
              onChange={(e) => handleOptionChange(e.value)}
              options={options}
              placeholder="Select an Option"
              className="dropdown-style"
            />
            <span className="c-button__blobs">
              <div></div><div></div><div></div>
            </span>
          </div>
        </section>
      </section>
    </div>
  );
};

export default ScenarioDropdown;
