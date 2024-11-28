import React, { useState, useEffect } from 'react';
import DataCard from './DataCard.jsx';
import AndhraMap from '../map/AndhraMap.jsx';
import WaterConsumptionGraph from '../graph/WaterConsumptionGraph.jsx';
import SpiderGraph from '../graph/SpiderGraph.jsx';

const ReservoirMainContent = () => {
    const [reservoirData, setReservoirData] = useState(null);
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
            if (selectedStateIndex === null || selectedYear === null) return;

            try {
                let response;
                let data;

                if (selectedYear > 2024) {
                    // Call the new API for years greater than 2024
                    response = await fetch(`http://127.0.0.1:8000/api/reservoir/get-reservoir-prediction/${selectedStateIndex}/${selectedYear}`);
                    if (response.ok) {
                        data = await response.json();
                        console.log(`Data for year ${selectedYear}:`, data);

                        // Set the reservoir data from prediction API
                        if (data.length > 0) {
                            const predictionData = data[0];
                            setReservoirData({
                                gross_capacity: predictionData.gross_capacity,
                                current_storage: predictionData.current_storage,
                                // Include any additional fields needed here
                            });
                        } else {
                            console.error(`No data found for year ${selectedYear}`);
                        }
                    } else {
                        console.error("API response error:", response.statusText);
                    }
                } else {
                    // Call the existing API for years less than or equal to 2024
                    response = await fetch(`http://localhost:8000/api/reservoir/get-reservoir-by-id/${selectedStateIndex}/${selectedYear}`);
                    if (response.ok) {
                        data = await response.json();
                        console.log(`Data for year ${selectedYear}:`, data);

                        // Assuming data for month 1 is needed
                        const monthOneData = data.find((reservoir) => reservoir.month === 1);
                        if (monthOneData) {
                            setReservoirData(monthOneData);
                        } else {
                            console.error(`No data found for month 1 in year ${selectedYear}`);
                        }
                    } else {
                        console.error("API response error:", response.statusText);
                    }
                }
            } catch (error) {
                console.error("Error fetching reservoir data:", error);
            }
        };

        fetchReservoirData();
    }, [selectedStateIndex, selectedYear]);

    return (
        <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
            <div className="flex flex-col justify-center items-center p-3 w-full">
                <section className="flex flex-row w-full">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between px-4 gap-10">
                            {/* Set a fixed width for DataCard to enforce layout */}
                            <div className="flex flex-col ">
                                <div className="flex w-full">
                                    <DataCard
                                        title="Current Level"
                                        value={reservoirData?.current_level || "N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <DataCard
                                        title="Current Storage"
                                        value={reservoirData?.current_storage || "N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <DataCard
                                        title="Flood Cushion"
                                        value={reservoirData?.flood_cushion || "N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <div className="flex w-full">
                                    <DataCard
                                        title="Gross Capacity"
                                        value={reservoirData?.gross_capacity || "N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <DataCard
                                        title="Inflow"
                                        value={reservoirData?.inflow || "N/A"}
                                        unit="m³/s"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <DataCard
                                        title="Outflow"
                                        value={reservoirData?.outflow || "N/A"}
                                        unit="m³/s"
                                    />
                                </div>
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
                    {/* <div className="flex flex-col flex-1 px-4">
                        <SpiderGraph />
                    </div> */}
                </section>
            </div>
        </main>
    );
};

export default ReservoirMainContent;
