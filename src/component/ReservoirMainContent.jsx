import React, { useState, useEffect } from 'react';
import DataCard from './DataCard.jsx';
import WaterConsumptionGraph from '../graph/WaterConsumptionGraph.jsx';
import ReservoirHealth from '../graph/ReservoirHealth.jsx';
import {BASE_URL} from '../Config.js'

const ReservoirMainContent = () => {
    const [reservoirData, setReservoirData] = useState(null);
    const [reservoirAge, setReservoirAge] = useState(null);
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const reservoirList = [
        { "name": "SRISAILAM R", "id": 1, "catchment_area": 206030 },
        { "name": "NAGARJUNA SAGAR", "id": 2, "catchment_area": 215194 },
        { "name": "PRAKASAM BARRAGE", "id": 4, "catchment_area": 251372 },
        { "name": "YELERU", "id": 5, "catchment_area": 2232 },
        { "name": "BRAHMAMSAGAR", "id": 6, "catchment_area": 240 },
        { "name": "TANDAVA", "id": 7, "catchment_area": 467 },
        { "name": "GUNDLAKAMMA", "id": 8, "catchment_area": 8195 },
        { "name": "THOTAPALLI BARRAGE", "id": 9, "catchment_area": 4455 },
        { "name": "GOTTA BARRAGE", "id": 10, "catchment_area": 10830 },
        { "name": "SOMASILA", "id": 11, "catchment_area": 50492.5 },
        { "name": "KANDALERU", "id": 12, "catchment_area": 4306 },
        { "name": "VELOGODU BALANCING", "id": 14, "catchment_area": 218.40 },
        { "name": "CHITRAVATI BALANCING", "id": 16, "catchment_area": 5431 },
        { "name": "MYLAVARAM(PENNAR)", "id": 17, "catchment_area": 19197 },
        { "name": "PAIDIPALEM BALANCING", "id": 18, "catchment_area": 20 },
        { "name": "ALAGANURU BALANCING", "id": 20, "catchment_area": 66 },
        { "name": "VAMIKONDA SAGAR", "id": 21, "catchment_area": 40 },
        { "name": "YELLANUR SR2", "id": 22, "catchment_area": 50 }
    ];

    const loadFromLocalStorage = () => {
        const district = parseInt(localStorage.getItem('selectedDistrict'), 10);
        const stateIndex = parseInt(localStorage.getItem('selectedReservoir'), 10);
        const year = parseInt(localStorage.getItem('selectedYear'), 10);
        const month = parseInt(localStorage.getItem('selectedMonth'), 10);
        setSelectedStateIndex(stateIndex);
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDistrict(district);
    };

    useEffect(() => {
        loadFromLocalStorage();
        window.addEventListener('storage', loadFromLocalStorage);

        return () => {
            window.removeEventListener('storage', loadFromLocalStorage);
        };
    }, []);

    const getReservoirName = () => {
        const reservoir = reservoirList.find((item) => item.id === selectedStateIndex);
        return reservoir ? reservoir.name : "Unknown";
    };

    const getCatchmentArea = () => {
        const reservoir = reservoirList.find((item) => item.id === selectedStateIndex);
        return reservoir ? reservoir.catchment_area : "N/A";
    };

    useEffect(() => {
        const fetchReservoirAge = async () => {
            if (selectedStateIndex === null || selectedYear === null || selectedDistrict === null || selectedMonth === null) return;

            try {
                const CurrentapiUrl = `${BASE_URL}/api/reservoir/get-score-data?year=${selectedYear}&reservoir_id=${selectedStateIndex}&district_id=${selectedDistrict}&month=${selectedMonth}`;
                const response = await fetch(CurrentapiUrl);

                if (response.ok) {
                    const data = await response.json();
                    setReservoirAge(data.age || "N/A");
                } else {
                    console.error("Failed to fetch reservoir age:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching reservoir age:", error);
            }
        };

        fetchReservoirAge();
    }, [selectedStateIndex, selectedYear, selectedDistrict, selectedMonth]);

    useEffect(() => {
        const fetchReservoirData = async () => {
            if (selectedStateIndex === null || selectedYear === null || selectedMonth === null) return;

            setLoading(true);

            try {
                let response;
                let data;

                if (selectedYear > 2024) {
                    response = await fetch(`${BASE_URL}/api/reservoir/get-reservoir-prediction/${selectedStateIndex}/${selectedYear}`);
                } else {
                    response = await fetch(`${BASE_URL}/api/reservoir/get-reservoir-by-id/${selectedStateIndex}/${selectedYear}`);
                }

                if (response.ok) {
                    data = await response.json();
                    if (data.length > 0) {
                        console.log("past data : " , data);
                        const monthData = data.find(month => month.month === selectedMonth);
                        console.log("month Data ; "  , monthData);
                        if (monthData) {
                            setReservoirData({
                                current_storage: monthData.current_storage.toFixed(2),
                                gross_capacity: monthData.gross_capacity.toFixed(2),
                                flood_cushion: (monthData.gross_capacity- monthData.current_storage).toFixed(2),
                            });
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching reservoir data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservoirData();
    }, [selectedStateIndex, selectedYear, selectedMonth]);

    

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
                                    title={`Catchment Area (${getReservoirName()})`}
                                    value={getCatchmentArea()}
                                    unit="Sq. Km"
                                />
                                <DataCard
                                    title={`Flood Cushion (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.flood_cushion || "N/A")}
                                    unit="TMC"
                                />
                            </div>
                            <div className="flex flex-col">
                                <DataCard
                                    title={` Storage (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={loading ? "Loading..." : (reservoirData?.current_storage || "N/A")}
                                    unit="TMC"
                                />
                                <DataCard
                                    title={`Age (${getReservoirName()} - ${selectedYear || "Year"})`}
                                    value={reservoirAge - (2024 - selectedYear) || "N/A"}
                                    unit="Years"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        {reservoirData ? (
                            <ReservoirHealth
                                current_storage={reservoirData.current_storage}
                                flood_cushion={reservoirData.flood_cushion}
                                gross_capacity={reservoirData.gross_capacity}
                            />
                        ) : (
                            <div
                                className="w-[650px] ml-3 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg mb-8"

                            >Loading.....</div>
                        )}
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
