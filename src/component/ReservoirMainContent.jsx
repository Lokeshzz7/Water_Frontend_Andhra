import React, { useState, useEffect } from 'react';
import data from '../data/reservoir_fake_data.json'; // Import your JSON data

import DataCard from './DataCard.jsx';
import ReservoirHealth from '../graph/ReservoirHealth.jsx';
import WaterConsumptionGraph from '../graph/WaterConsumptionGraph.jsx';
import ScatterChart from './charts/ScatterChart.jsx';
import SpiderGraph from '../graph/SpiderGraph.jsx';
import AndraMap from '../map/AndhraMap.jsx';

const ReservoirMainContent = () => {
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
        <div>
            <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
                <section className="mt-7 mb-4 w-full max-w-[2100px] max-md:max-w-full">
                    <div className="flex pl-5 gap-5 max-md:flex-col">
                        <div className="flex flex-row">
                            <div className="gap-14">
                                <DataCard
                                    title="Current Capacity"
                                    value={currentCapacity}
                                    unit="galH2O"
                                />
                                <DataCard
                                    title="Current Storage"
                                    value={currentStorage}
                                    unit="galH2O"
                                />
                            </div>
                            <div className='w-full'>
                                <ReservoirHealth />
                                {/* <AndraMap /> */}
                            </div>
                        </div>
                        <div>
                            <WaterConsumptionGraph />
                        </div>
                    </div>
                </section>
                <section className="mt-19 w-full max-w-[1900px] max-md:max-w-full">
                    <div className="flex max-md:flex-col">
                        <ScatterChart />
                        <SpiderGraph />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReservoirMainContent;
