import React, { useState, useEffect } from 'react';
import WaterUsageCard from './component/WaterUsageCard';
import WaterUsageChart from './component/WaterUsageChart';
import LucGraph from './graph/LucGraph';
import FilterDropdown from './component/FilterDropdown';  // Import FilterDropdown
import LinearGauge from './graph/LinearGauge';
import WaterLinear from './component/WaterLinear';
import PopulationWater from './graph/PopulationWater';
import WaterLinearCurrent from './component/WaterLinearCurrent';
import AndhraMap from './map/AndhraMap.jsx';
import StateMap from './map/StateMap.jsx';
import data from '../src/data/reservoir_fake_data.json'; // Import your JSON data

import DataCard from '../src/component/DataCard.jsx';
import Andhra2 from './map/Andra2.jsx';
import PopulationAndWater from './graph/PopulationandWater.jsx';


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
        <main className="flex overflow-hidden flex-col justify-evenly items-center  py-9 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue max-md:px-5">
            < FilterDropdown />

            <div className='flex flex-col justify-center items-center p-3'>

                <section className="flex flex-row w-screen">
                    <div className="flex flex-col w-1/2 pl-8"> {/* Left side */}
                        <div className="flex flex-row">
                            <div className="flex flex-col w-full ml-9">
                                <DataCard title="Current Capacity" value={currentCapacity} unit="galH2O" />
                                <DataCard title="Current Storage" value={currentStorage} unit="galH2O" />
                            </div>
                            <div className="flex flex-col w-full">
                                <DataCard title="Future Capacity" value={currentCapacity} unit="galH2O" />
                                <DataCard title="Future Storage" value={currentStorage} unit="galH2O" />
                            </div>
                        </div>
                        <div className="w-full pl-5 mt-4"> {/* Ensure space between sections */}
                            <LinearGauge />
                        </div>
                    </div>
                    <div className="w-5/12 "> {/* Ensure `relative` to avoid content spill */}
                        {/* <AndhraMap /> */}
                        <PopulationAndWater />


                    </div>
                </section>

                <section className="flex flex-row w-screen mt-20">
                    <div className="flex flex-col w-1/2 pl-8">
                        {/* <div className='flex flex-row'></div> */}
                        <div className='w-full pl-5'>
                        </div>
                    </div>
                    <div className="w-5/12 "> {/* Add `relative` for isolation */}
                        <PopulationWater />
                        <LucGraph />
                    </div>
                </section>

            </div>


            {/* <section className="mt-7 w-full  max-md:max-w-full">
                <div className="flex  max-md:flex-col">
                    <WaterUsageCard />
                    <WaterLinearCurrent />
        
                    <WaterLinear />



                    <WaterUsageChart title="This month" value="35.25" percentage="+2.45%" status="On track" />


                </div>
            </section> */}
            {/* <section className="mt-17 w-full  max-md:max-w-full">
                <div className="flex gap-8 max-md:flex-col">
                    <LucGraph />

                    <PopulationWater />
                    <LinearGauge />
                </div>
            </section> */}
        </main >
    );
}

export default WaterManagementDashboard;
