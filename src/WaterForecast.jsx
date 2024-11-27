import React, { useState, useEffect } from "react";
import WaterUsageCard from "./component/WaterUsageCard";
import WaterUsageChart from "./component/WaterUsageChart";
import LucGraph from "./graph/LucGraph";
import LinearGauge from "./graph/LinearGauge";
import AndhraMap from "./map/AndhraMap.jsx";
import data from "../src/data/reservoir_fake_data.json";
import DataCard from "../src/component/DataCard.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import DistrictDropdown from "./component/Districtdropdown.jsx";

function WaterManagementDashboard() {
    const [currentCapacity, setCurrentCapacity] = useState(null);
    const [currentStorage, setCurrentStorage] = useState(null);
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const [selectedDistrict, setSelectedDistrict] = useState(() => {
        try {
            return localStorage.getItem("selectedDistrict") || null;
        } catch {
            return null;
        }
    });

    const [districts, setDistricts] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    const [selectedYearOption, setSelectedYearOption] = useState(null);
    const yearOptions = [
        { label: "2022", value: 2022 },
        { label: "2023", value: 2023 },
    ];

    // Fetch districts on load
    useEffect(() => {
        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const response = await fetch("http://127.0.0.1:8000/api/forecast/get-districts");
                const data = await response.json();
                const districtOptions = data.map((district) => ({
                    label: district.name,
                    value: district.id,
                }));
                setDistricts(districtOptions);
            } catch (error) {
                console.error("Error fetching districts:", error);
                setDistricts([]);
            } finally {
                setLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, []);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrict(districtId);
        localStorage.setItem("selectedDistrict", districtId);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        localStorage.setItem("selectedYear", year);
    };

    useEffect(() => {
        if (selectedStateIndex !== null && selectedYear !== null && data) {
            const filteredData = data.find(
                (item) =>
                    item.index === selectedStateIndex &&
                    item.year.toString() === selectedYear.toString()
            );

            if (filteredData) {
                setCurrentCapacity(Math.trunc(filteredData.currentCapacity));
                setCurrentStorage(Math.trunc(filteredData.currentStorage));
            } else {
                setCurrentCapacity(null);
                setCurrentStorage(null);
            }
        }
    }, [selectedStateIndex, selectedYear]);

    return (
        <main className="flex flex-col justify-evenly items-center py-9 bg-darkslateblue shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] max-md:px-5 overflow-hidden">
            {/* Flex container for all dropdowns */}
            <div className="flex flex-row gap-5 justify-start items-center w-full px-4">
                {/* Existing Dropdowns (State and Year) */}
                <FilterDropdown />

                {/* District Dropdown */}
                <DistrictDropdown
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                />
            </div>

            {/* Remaining content */}
            <div className="flex flex-col justify-center items-center p-3 w-full">
                <section className="flex flex-row w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-wrap px-4">
                            <DataCard title="Current Capacity" value={currentCapacity} unit="galH2O" />
                            <DataCard title="Current Storage" value={currentStorage} unit="galH2O" />
                        </div>
                        <div>
                            <LinearGauge />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        <AndhraMap />
                    </div>
                </section>

                <section className="flex flex-row w-full mt-20">
                    <div className="flex flex-col flex-1 px-4">
                        <LucGraph />
                    </div>
                </section>
            </div>
        </main>
    );
}

export default WaterManagementDashboard;
