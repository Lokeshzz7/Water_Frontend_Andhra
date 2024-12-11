import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

const MonthDropdown = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem("selectedMonthReservoir")
      ? parseInt(localStorage.getItem("selectedMonthReservoir"))
      : null;
  });

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const handleMonthChange = (monthValue) => {
    setSelectedMonth(monthValue);
    localStorage.setItem("selectedMonth", monthValue);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-wrap gap-10 w-[10s00px] tracking-tight leading-none text-red-900 whitespace-nowrap max-w-full">
        <section className="filter-dropdown-container">
          <Dropdown
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.value)}
            options={months}
            placeholder="Select Month"
            className="dropdown-style mt-5 ml-5 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-[280px] text-red-900"
          />
        </section>
      </section>
    </div>
  );
};

export default MonthDropdown;
