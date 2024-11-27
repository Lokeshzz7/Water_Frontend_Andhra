import React, { useState, useEffect } from 'react';
import data from '../data/reservoir_fake_data.json'; // Import your JSON data

import DataCard from './DataCard.jsx';
import ReservoirHealth from '../graph/ReservoirHealth.jsx';
import WaterConsumptionGraph from '../graph/WaterConsumptionGraph.jsx';
import SpiderGraph from '../graph/SpiderGraph.jsx';
import AndhraMap from '../map/AndhraMap.jsx';


const ReservoirMainContent = () => {
    const [currentCapacity, setCurrentCapacity] = useState(null);
    const [currentStorage, setCurrentStorage] = useState(null);
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    // Function to load data from localStorage
    const loadFromLocalStorage = () => {
        const stateIndex = parseInt(localStorage.getItem('selectedReservoir'), 10);
        const year = parseInt(localStorage.getItem('selectedYear'), 10);
        setSelectedStateIndex(stateIndex);
        setSelectedYear(year);
    };

    // Effect to initialize and listen to localStorage changes
    useEffect(() => {
        loadFromLocalStorage();
        window.addEventListener('storage', loadFromLocalStorage);

        return () => {
            window.removeEventListener('storage', loadFromLocalStorage);
        };
    }, []);

    // Fetch data from API
    useEffect(() => {
        const fetchReservoirData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/reservoir/get-reservoir-by-id/5/2022");
                console.log("Response Object:", response);

                if (response.ok) {
                    const contentType = response.headers.get("Content-Type");
                    if (contentType && contentType.includes("application/json")) {
                        // Parse the JSON response
                        const data = await response.json();
                        console.log("Parsed JSON Data:", data);

                        // Store values in an array
                        const reservoirArray = data.map(reservoir => ({
                            id: reservoir.id,
                            reservoir: reservoir.reservoir,
                            district: reservoir.district,
                            basin: reservoir.basin,
                            gross_capacity: reservoir.gross_capacity,
                            current_level: reservoir.current_level,
                            current_storage: reservoir.current_storage,
                            flood_cushion: reservoir.flood_cushion,
                            inflow: reservoir.inflow,
                            outflow: reservoir.outflow,
                            year: reservoir.year,
                            month: reservoir.month
                        }));

                        // Log the array with a descriptive message
                        console.log("The get-reservoir-by-id array:", reservoirArray);
                    } else {
                        console.error("Error: Response is not JSON");
                        const text = await response.text();
                        console.log("Raw Response Text:", text);
                    }
                } else {
                    console.error("Error: Response not OK", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };


        fetchReservoirData();
    }, [selectedStateIndex, selectedYear]);



    return (
        <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
            <div className="flex flex-col justify-center items-center p-3 w-full">
                <section className="flex flex-row w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row flex-1 px-4">
                            <div className="flex flex-wrap ">
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
                            <div className="flex flex-wrap ">
                                <DataCard
                                    title="Future Capacity"
                                    value={currentCapacity}
                                    unit="galH2O"
                                />
                                <DataCard
                                    title="Future Storage"
                                    value={currentStorage}
                                    unit="galH2O"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        <AndhraMap />
                    </div>
                </section>

                <section className="flex flex-row w-full mt-20">
                    <div className="flex flex-col flex-1 px-4">
                        <WaterConsumptionGraph />
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        <SpiderGraph />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ReservoirMainContent;
