import React, { useState, useEffect } from 'react';
import DataCard from './DataCard.jsx';
import AndhraMap from '../map/AndhraMap.jsx';
import WaterConsumptionGraph from '../graph/WaterConsumptionGraph.jsx';
import ReservoirStatus from '../ReservoirStatus.jsx';
import ReservoirHealth from '../graph/ReservoirHealth.jsx';

const ReservoirMainContent = () => {
    const [reservoirData, setReservoirData] = useState(null);
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reservoir mapping data
    const reservoirList = [
        { "name": "SRISAILAM R", "id": 1 },
        { "name": "NAGARJUNA SAGAR", "id": 2 },
        { "name": "PULICHINTHALA PROJECT", "id": 3 },
        { "name": "PRAKASAM BARRAGE", "id": 4 },
        { "name": "YELERU", "id": 5 },
        { "name": "BRAHMAMSAGAR", "id": 6 },
        { "name": "TANDAVA", "id": 7 },
        { "name": "GUNDLAKAMMA", "id": 8 },
        { "name": "THOTAPALLI BARRAGE", "id": 9 },
        { "name": "GOTTA BARRAGE", "id": 10 },
        { "name": "SOMASILA", "id": 11 },
        { "name": "KANDALERU", "id": 12 },
        { "name": "GANDIKOTA", "id": 13 },
        { "name": "VELOGODU BALANCING", "id": 14 },
        { "name": "PENNA AHOBILAM BALANCING", "id": 15 },
        { "name": "CHITRAVATI BALANCING", "id": 16 },
        { "name": "MYLAVARAM(PENNAR)", "id": 17 },
        { "name": "PAIDIPALEM BALANCING", "id": 18 },
        { "name": "SARVARAJA SAGAR", "id": 19 },
        { "name": "ALAGANURU BALANCING", "id": 20 },
        { "name": "VAMIKONDA SAGAR", "id": 21 },
        { "name": "YELLANUR SR2", "id": 22 },
        { "name": "THIMMAPURAM SR1", "id": 23 }
    ]
    
        ;

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

    // Get the reservoir name based on selectedStateIndex
    const getReservoirName = () => {
        const reservoir = reservoirList.find((item) => item.id === selectedStateIndex);
        return reservoir ? reservoir.name : "Unknown";
    };

    // Fetch data from API
    useEffect(() => {
        const fetchReservoirData = async () => {
            if (selectedStateIndex === null || selectedYear === null) return;

            setLoading(true);

            try {
                let response;
                let data;

                if (selectedYear > 2024) {
                    response = await fetch(`http://127.0.0.1:8000/api/reservoir/get-reservoir-prediction/${selectedStateIndex}/${selectedYear}`);
                } else {
                    response = await fetch(`http://localhost:8000/api/reservoir/get-reservoir-by-id/${selectedStateIndex}/${selectedYear}`);
                }

                if (response.ok) {
                    data = await response.json();
                    if (data.length > 0) {
                        let totalCurrentLevel = 0;
                        let totalCurrentStorage = 0;
                        let totalFloodCushion = 0;
                        let totalGrossCapacity = 0;
                        let totalInflow = 0;
                        let totalOutflow = 0;

                        data.forEach((monthData) => {
                            if (monthData.current_level !== -999) totalCurrentLevel += monthData.current_level;
                            if (monthData.current_storage !== -999) totalCurrentStorage += monthData.current_storage;
                            if (monthData.flood_cushion !== -999) totalFloodCushion += monthData.flood_cushion;
                            if (monthData.gross_capacity !== -999) totalGrossCapacity += monthData.gross_capacity;
                            if (monthData.inflow !== -999) totalInflow += monthData.inflow;
                            if (monthData.outflow !== -999) totalOutflow += monthData.outflow;
                        });

                        setReservoirData({
                            current_level: totalCurrentLevel.toFixed(2),
                            current_storage: totalCurrentStorage.toFixed(2),
                            flood_cushion: totalFloodCushion.toFixed(2),
                            gross_capacity: totalGrossCapacity.toFixed(2),
                            inflow: totalInflow.toFixed(2),
                            outflow: totalOutflow.toFixed(2),
                        });
                    } else {
                        console.error(`No data found for year ${selectedYear}`);
                    }
                } else {
                    console.error("API response error:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching reservoir data:", error);
            } finally {
                setLoading(false);
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
                            <div className="flex flex-col">
                            <DataCard
                                    title={`Gross Capacity (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.gross_capacity || "N/A")}
                                    unit="TMC"
                                />
                                <DataCard
                                    title={`Current Level (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.current_level || "N/A")}
                                    unit="Ft"
                                />
                                <DataCard
                                    title={`Inflow (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.inflow || "N/A")}
                                    unit="Cusecs"
                                />
                            </div>
                            <div className="flex flex-col">
                            <DataCard
                                    title={`Current Storage (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.current_storage || "N/A")}
                                    unit="TMC"
                                />
                                <DataCard
                                    title={`Flood Cushion (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.flood_cushion || "N/A")}
                                    unit="TMC"
                                />
                                
                                <DataCard
                                    title={`Outflow (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.outflow || "N/A")}
                                    unit="Cusecs"
                                />
                                
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        {/* <AndhraMap /> */}
                        <ReservoirHealth />
                        <div className='flex flex-row justify-evenly px-4 gap-10'>
                        <DataCard
                                    title={`Age (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.flood_cushion || "N/A")}
                                    unit="Years"
                                />
                                
                                <DataCard
                                    title={`Siltation (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.outflow || "N/A")}
                                    unit="TMC"
                                />
                        </div>
                    </div>
                </section>

                <section className="flex flex-row w-full mt-20">
                    <div className="flex flex-col flex-1 px-4">
                        <WaterConsumptionGraph />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ReservoirMainContent;
