import React, { useState, useEffect } from "react";
import WaterUsageCard from "./component/WaterUsageCard";
import AndhraMap from "./map/AndhraMap.jsx";
import DataCard from "./component/DataCard.jsx";
import CurrentLinearGauge from "./graph/CurrentLinearGraph.jsx";
import LinearGauge from "./graph/LinearGauge.jsx";
import LucGraph from "./graph/LucGraph";
import RainfallGraph from "./graph/RainfallGraph.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import FactorsAffectingGraph from "./graph/FactorsAffectiongGraph.jsx";
import Months from "./graph/monthsConsumptionGraph.jsx";

function WaterManagementDashboard() {
    const [currentYearData, setCurrentYearData] = useState(null);
    const [futureYearData, setFutureYearData] = useState(null);
    const [loadingCurrentYear, setLoadingCurrentYear] = useState(false);
    const [loadingFutureYear, setLoadingFutureYear] = useState(false);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);

    const fetchHistoricalYearData = (districtId, selectedYear, selectedMonth) => {
        setLoadingFutureYear(true);
        fetch(`http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${selectedYear}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const monthData = data[selectedMonth - 1];
                    if (monthData) {
                        setFutureYearData({
                            consumption: monthData.consumption,
                            inflow: monthData.rainfall ,
                        });
                    } else {
                        console.error("No data found for the selected month.");
                    }
                } else {
                    console.error("No data found for the selected year.");
                }
            })
            .catch((error) => console.error("Error fetching historical year data:", error))
            .finally(() => setLoadingFutureYear(false));
    };

    const fetchFutureYearData = (districtId, selectedYear, selectedMonth) => {
        setLoadingFutureYear(true);
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${selectedYear}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const monthData = data[selectedMonth - 1];
                    if (monthData) {
                        setFutureYearData({
                            consumption: monthData.consumption,
                            inflow: monthData.rainfall ,
                        });
                    } else {
                        console.error("No data found for the selected month.");
                    }
                } else {
                    console.error("No data found for the selected year.");
                }
            })
            .catch((error) => console.error("Error fetching future year data:", error))
            .finally(() => setLoadingFutureYear(false));
    };

    const fetchCurrentYearData = (districtId, selectedYear, selectedMonth) => {
        setLoadingCurrentYear(true);
        fetch(`http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/2024`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const monthData = data[selectedMonth - 1];
                    if (monthData) {
                        setCurrentYearData({
                            consumption: monthData.consumption,
                            inflow: monthData.rainfall,
                        });
                    } else {
                        console.error("No data found for the selected month.");
                    }
                } else {
                    console.error("No data found for the selected year.");
                }
            })
            .catch((error) => console.error("Error fetching current year data:", error))
            .finally(() => setLoadingCurrentYear(false));
    };

    useEffect(() => {
        const districtId = localStorage.getItem("selectedDistrict");
        const selectedYear = parseInt(localStorage.getItem("selectedYear"), 10);
        const selectedMonth = parseInt(localStorage.getItem("selectedMonth"), 10);

        if (!districtId || !selectedYear) {
            console.error("District or Year is missing in localStorage");
            return;
        }

        setYear(selectedYear);
        setMonth(selectedMonth);

        fetchCurrentYearData(districtId, selectedYear, selectedMonth);
        if (selectedYear < 2024) {
            fetchHistoricalYearData(districtId, selectedYear, selectedMonth);
        } else {
            fetchFutureYearData(districtId, selectedYear, selectedMonth);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const districtId = localStorage.getItem("selectedDistrict");
            const selectedYear = parseInt(localStorage.getItem("selectedYear"), 10);
            const selectedMonth = parseInt(localStorage.getItem("selectedMonth"), 10);

            if (!districtId || !selectedYear) {
                console.error("District or Year is missing in localStorage");
                return;
            }

            setYear(selectedYear);
            setMonth(selectedMonth);

            setLoadingCurrentYear(true);
            setLoadingFutureYear(true);

            fetchCurrentYearData(districtId, selectedYear, selectedMonth);
            if (selectedYear < 2024) {
                fetchHistoricalYearData(districtId, selectedYear, selectedMonth);
            } else {
                fetchFutureYearData(districtId, selectedYear, selectedMonth);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <main className="flex flex-col justify-evenly items-center pt-5 bg-darkslateblue shadow-lg max-md:px-5 overflow-hidden">
            <div className="flex flex-row justify-start items-center w-full">
                <FilterDropdown />
            </div>
            <section className="flex flex-row w-full mt-8">
                <div className="flex flex-row w-full p-2">
                    <div className="flex flex-row w-full">
                        <div className="flex flex-wrap pl-4">
                            <DataCard
                                title={` Consumption (2024-${month}) `}
                                value={loadingCurrentYear ? "Loading..." : (currentYearData ? currentYearData.consumption.toFixed(2) : "N/A")}
                                unit={"TMC"}
                            />
                            <DataCard
                                title={` Inflow (2024-${month})`}
                                value={loadingCurrentYear ? "Loading..." : (currentYearData ? currentYearData.inflow.toFixed(2) : "N/A")}
                                unit={"TMC"}
                            />
                        </div>
                        <CurrentLinearGauge />
                    </div>
                    <div className="flex flex-row w-full">
                        <div className="flex flex-wrap">
                            <DataCard
                                title={` Consumption (${year}-${month})`}
                                value={loadingFutureYear ? "Loading..." : (futureYearData ? futureYearData.consumption.toFixed(2) : "N/A")}
                                unit={"TMC"}
                            />
                            <DataCard
                                title={` Inflow (${year}-${month})`}
                                value={loadingFutureYear ? "Loading..." : (futureYearData ? futureYearData.inflow.toFixed(2) : "N/A")}
                                unit={"TMC"}
                            />
                        </div>
                        <LinearGauge />
                    </div>
                </div>
            </section>
            <section className="flex flex-row w-full">
                <div className="flex flex-row flex-1 p-3 gap-7">
                    <LucGraph />
                    <Months />
                </div>
            </section>
            <section className="flex flex-row w-full">
                <div className="flex flex-row flex-1 p-3 gap-7">
                    <RainfallGraph />
                    <FactorsAffectingGraph />
                </div>
            </section>
        </main>
    );
}

export default WaterManagementDashboard;
