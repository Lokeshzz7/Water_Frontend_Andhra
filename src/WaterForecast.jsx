import React, { useState, useEffect } from 'react';
import WaterUsageCard from './component/WaterUsageCard';
import WaterUsageChart from './component/WaterUsageChart';
import LucGraph from './graph/LucGraph';
import FilterDropdown from './component/FilterDropdown';  // Import FilterDropdown
import LinearGauge from './graph/LinearGauge';
import WaterLinear from './component/WaterLinear';
import WaterLinearCurrent from './component/WaterLinearCurrent';
import AndhraMap from './map/AndhraMap.jsx';
import StateMap from './map/StateMap.jsx';
import data from '../src/data/reservoir_fake_data.json'; // Import your JSON data

import DataCard from '../src/component/DataCard.jsx';


function WaterManagementDashboard() {
    const [selectedData, setSelectedData] = useState([]);

    // Handle selected data from FilterDropdown
    const handleDataSelect = (data) => {
        setSelectedData(data);
    };
    const [currentCapacity, setCurrentCapacity] = useState(null);
    const [currentStorage, setCurrentStorage] = useState(null);
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    // Function to load data from localStorage
    const loadFromLocalStorage = () => {
        const stateIndex = parseInt(localStorage.getItem('selectedState'), 10);
        const year = parseInt(localStorage.getItem('selectedYear'), 10);
        setSelectedStateIndex(stateIndex);
        setSelectedYear(year);
    };

    // Effect to initialize and listen to localStorage changes
    useEffect(() => {
        // Initial load from localStorage
        loadFromLocalStorage();

        // Listen for storage changes
        window.addEventListener('storage', loadFromLocalStorage);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('storage', loadFromLocalStorage);
        };
    }, []);

    // Effect to update data based on selected state and year
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
            <FilterDropdown />

            <div className="flex flex-col justify-center items-center p-3 w-full">
                <section className="flex flex-row w-full">
                    <div className='flex flex-col  w-full'>
                        <div className="flex flex-row flex-1 px-4"> {/* Left side */}
                            <div className="flex flex-wrap "> {/* Added responsive layout */}
                                <DataCard title="Current Capacity" value={currentCapacity} unit="galH2O" />
                                <DataCard title="Current Storage" value={currentStorage} unit="galH2O" />
                            </div>
                            <div className="flex flex-wrap "> {/* Added responsive layout */}
                                <DataCard title="Current Capacity" value={currentCapacity} unit="galH2O" />
                                <DataCard title="Current Storage" value={currentStorage} unit="galH2O" />
                            </div>
                        </div>
                        <div>
                            <LinearGauge />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4"> {/* Right side */}
                        <AndhraMap />
                    </div>
                </section>

                <section className="flex flex-row w-full mt-20">
                    <div className="flex flex-col flex-1 px-4">
                        <LucGraph />
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        {/* <PopulationWater /> */}
                    </div>
                </section>
            </div>
        </main>

    );
}

export default WaterManagementDashboard;