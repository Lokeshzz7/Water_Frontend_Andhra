import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

const FilterDropdown = () => {
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem("selectedState")
      ? parseInt(localStorage.getItem("selectedState"))
      : null;
  });

  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem("selectedDistrict")
      ? parseInt(localStorage.getItem("selectedDistrict"))
      : null;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return localStorage.getItem("selectedYear")
      ? parseInt(localStorage.getItem("selectedYear"))
      : null;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem("selectedMonth")
      ? parseInt(localStorage.getItem("selectedMonth"))
      : null;
  });

  const [selectedReservoir, setSelectedReservoir] = useState(() => {
    return localStorage.getItem("selectedReservoir")
      ? parseInt(localStorage.getItem("selectedReservoir"))
      : null;
  });

  const [reservoirOptions, setReservoirs] = useState([]);
  const [loading, setLoading] = useState(false);

  const states = [
    { id: "IN-AP", name: "Andhra Pradesh", value: 16 },
    // Additional states can be added here
  ];

  const districtDataReservoirPage = [
    { id: 3, name: "Anantapur" },
    { id: 7, name: "East Godavari" },
    { id: 9, name: "Guntur" },
    { id: 26, name: "Y.S.R Kadapa" },
    { id: 13, name: "Krishna" },
    { id: 10, name: "Kurnool" },
    { id: 20, name: "Sri Potti Sriramulu Nellore" },
    { id: 18, name: "Prakasam" },
    { id: 21, name: "Srikakulam" },
    { id: 23, name: "Visakhapatnam" },
    { id: 24, name: "Vizianagaram" },
  ];

  const districtDataAllPages = [
    { id: 3, name: "Anantapur" },
    { id: 6, name: "Chittoor" },
    { id: 7, name: "East Godavari" },
    { id: 9, name: "Guntur" },
    { id: 26, name: "Y.S.R Kadapa" },
    { id: 13, name: "Krishna" },
    { id: 10, name: "Kurnool" },
    { id: 20, name: "Sri Potti Sriramulu Nellore" },
    { id: 18, name: "Prakasam" },
    { id: 21, name: "Srikakulam" },
    { id: 23, name: "Visakhapatnam" },
    { id: 24, name: "Vizianagaram" },
    { id: 25, name: "West Godavari" },
  ];

  const isReservoirPage = window.location.pathname === "/reservoirstatus";
  const isScenarioPlanningPage = window.location.pathname === "/scenarioplanning";
  const isWaterForecastPage = window.location.pathname.startsWith("/waterforecast");

  const years = Array.from({ length: 16 }).map((_, i) => ({
    label: `Year ${2029 - i}`,
    value: 2029 - i,
  }));

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

  const fetchReservoirs = async (districtId) => {
    if (!districtId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservoir/get-all-reservoirs/${districtId}`
      );
      const data = await response.json();
      console.log("Fetched Reservoirs Data:", data);

      if (Array.isArray(data) && data.length) {
        const reservoirOptions = data.map((reservoir) => ({
          label: reservoir.name,
          value: reservoir.id,
        }));
        setReservoirs(reservoirOptions);

        if (!reservoirOptions.some((res) => res.value === selectedReservoir)) {
          setSelectedReservoir(null);
        }
      } else {
        setReservoirs([]);
        setSelectedReservoir(null);
      }
    } catch (error) {
      console.error("Error fetching reservoirs:", error);
      setReservoirs([]);
      setSelectedReservoir(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (stateValue) => {
    setSelectedState(stateValue);
    const state = states.find((s) => s.value === stateValue);
    if (state) {
      localStorage.setItem("selectedState", stateValue);
      localStorage.setItem("StateMapId", state.id);
    }
    window.dispatchEvent(new Event("storage"));
  };

  const handleDistrictChange = (districtValue) => {
    setSelectedDistrict(districtValue);
    localStorage.setItem("selectedDistrict", districtValue);
    window.dispatchEvent(new Event("storage"));
    if (isReservoirPage) {
      fetchReservoirs(districtValue);
    }
  };

  const handleReservoirChange = (reservoirId) => {
    setSelectedReservoir(reservoirId);
    localStorage.setItem("selectedReservoir", reservoirId);
    window.dispatchEvent(new Event("storage"));
  };

  const handleYearChange = (yearValue) => {
    setSelectedYear(yearValue);
    localStorage.setItem("selectedYear", yearValue);
    window.dispatchEvent(new Event("storage"));
  };

  const handleMonthChange = (monthValue) => {
    setSelectedMonth(monthValue);
    localStorage.setItem("selectedMonth", monthValue);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    if (isReservoirPage && selectedDistrict !== null) {
      fetchReservoirs(selectedDistrict);
    }
  }, [selectedDistrict, isReservoirPage]);

  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-wrap gap-10 w-full tracking-tight leading-none text-red-900 whitespace-nowrap max-w-full">
        <section className="filter-dropdown-container">
          <Dropdown
            value={selectedState}
            onChange={(e) => handleStateChange(e.value)}
            options={states.map((state) => ({
              label: state.name,
              value: state.value,
            }))}
            placeholder="Select State"
            className="dropdown-style ml-5 mr-5 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/3 text-red-900"
          />

          <Dropdown
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.value)}
            options={(isReservoirPage
              ? districtDataReservoirPage
              : districtDataAllPages
            ).map((district) => ({
              label: district.name,
              value: district.id,
            }))}
            placeholder="Select District"
            className="dropdown-style ml-5 mr-5 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/3"
          />

          {isReservoirPage && (
            <Dropdown
              value={selectedReservoir}
              onChange={(e) => handleReservoirChange(e.value)}
              options={reservoirOptions}
              placeholder={
                loading
                  ? "Loading reservoirs..."
                  : selectedDistrict
                    ? "Select Reservoir"
                    : "Select a District First"
              }
              className="dropdown-style ml-5 mr-5 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/3"
              disabled={loading || !reservoirOptions.length}
            />
          )}

          {isWaterForecastPage && (
            <Dropdown
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.value)}
              options={months}
              placeholder="Select Month"
              className="dropdown-style ml-5 mr-5 rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/3 text-red-900"
            />
          )}

          {!isScenarioPlanningPage && (
            <Dropdown
              value={selectedYear}
              onChange={(e) => handleYearChange(e.value)}
              options={years}
              placeholder="Select Year"
              className="dropdown-style rounded-xl p-3 font-bold text-4xl bg-slate-100 w-1/3"
            />
          )}
        </section>
      </section>
    </div>
  );
};

export default FilterDropdown;
