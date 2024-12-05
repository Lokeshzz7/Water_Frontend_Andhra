import React, { useState, useEffect } from "react";
import WaterUsageCard from "./component/WaterUsageCard";
import AndhraMap from "./map/AndhraMap.jsx";
import DataCard from "./component/DataCard.jsx";
import CurrentLinearGauge from "./graph/CurrentLinearGraph.jsx";
import LinearGauge from "./graph/LinearGauge.jsx";
import LucGraph from "./graph/LucGraph";
import RainfallGraph from "./graph/RainfallGraph.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import DistrictDropdown from "./component/Districtdropdown.jsx";
import FactorsAffectingGraph from "./graph/FactorsAffectiongGraph.jsx";
import Months from "./graph/monthsConsumptionGraph.jsx";

function WaterManagementDashboard() {
    const [currentYearData, setCurrentYearData] = useState(null);
    const [futureYearData, setFutureYearData] = useState(null);
    const [loadingCurrentYear, setLoadingCurrentYear] = useState(false); // Added loading state for current year
    const [loadingFutureYear, setLoadingFutureYear] = useState(false); // Added loading state for future year
    const [Year, setYear] = useState(null); // State for selected year


    const fetchHistoricalYearData = (districtId, selectedYear) => {
        setLoadingFutureYear(true); // Set loading state for future year
        fetch(`http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${selectedYear}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Complete historical data:', data);

                if (Array.isArray(data) && data.length > 0) {
                    // Calculate average consumption and inflow
                    const totalConsumption = data.reduce((sum, entry) => sum + entry.consumption, 0);
                    const totalInflow = data.reduce((sum, entry) => sum + (entry.rainfall + entry.inflow_state), 0);
                    const numberOfMonths = data.length;

                    const averageConsumption = totalConsumption;
                    const averageInflow = totalInflow;

                    setFutureYearData({
                        consumption: averageConsumption,
                        inflow: averageInflow,
                    });
                } else {
                    console.error('No data found for the selected year.');
                }
            })
            .catch((error) => console.error("Error fetching historical year data:", error))
            .finally(() => {
                setLoadingFutureYear(false); // Set loading state to false after fetching
            });
    };

    const fetchFutureYearData = (districtId, selectedYear) => {
        setLoadingFutureYear(true); // Set loading state for future year
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${selectedYear}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Complete future data:', data);

                if (Array.isArray(data) && data.length > 0) {
                    // Calculate average consumption and inflow
                    const totalConsumption = data.reduce((sum, entry) => sum + entry.consumption, 0);
                    const totalInflow = data.reduce((sum, entry) => sum + (entry.rainfall + entry.inflow_states), 0);
                    const numberOfMonths = data.length;

                    const averageConsumption = totalConsumption;
                    const averageInflow = totalInflow;

                    setFutureYearData({
                        consumption: averageConsumption,
                        inflow: averageInflow,
                    });
                } else {
                    console.error('No data found for the selected year.');
                }
            })
            .catch((error) => console.error("Error fetching future year data:", error))
            .finally(() => {
                setLoadingFutureYear(false); // Set loading state to false after fetching
            });
    };

    const fetchCurrentYearData = (districtId, selectedYear) => {
        setLoadingCurrentYear(true); // Set loading state for current year
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/2024`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Complete current data:', data);

                if (Array.isArray(data) && data.length > 0) {
                    // Calculate average consumption and inflow
                    const totalConsumption = data.reduce((sum, entry) => sum + entry.consumption, 0);
                    const totalInflow = data.reduce((sum, entry) => sum + (entry.rainfall + entry.inflow_states), 0);
                    const numberOfMonths = data.length;

                    const averageConsumption = totalConsumption;
                    const averageInflow = totalInflow;

                    setCurrentYearData({
                        consumption: averageConsumption,
                        inflow: averageInflow,
                    });
                } else {
                    console.error('No data found for the selected year.');
                }
            })
            .catch((error) => console.error("Error fetching current year data:", error))
            .finally(() => {
                setLoadingCurrentYear(false); // Set loading state to false after fetching
            });
    };

    useEffect(() => {
        const districtId = localStorage.getItem("selectedDistrict");
        const selectedYear = parseInt(localStorage.getItem("selectedYear"), 10);

        if (!districtId || !selectedYear) {
            console.error("District or Year is missing in localStorage");
            return;
        }

        setYear(selectedYear);

        fetchCurrentYearData(districtId, selectedYear);
        // If the selected year is less than 2024, fetch historical data
        if (selectedYear < 2024) {
            fetchHistoricalYearData(districtId, selectedYear);
        }
        // Otherwise, fetch future year data
        else {
            fetchFutureYearData(districtId, selectedYear);
        }
    }, []); // Run only on component mount

    useEffect(() => {
        const handleStorageChange = () => {
            const districtId = localStorage.getItem("selectedDistrict");
            const selectedYear = parseInt(localStorage.getItem("selectedYear"), 10);

            if (!districtId || !selectedYear) {
                console.error("District or Year is missing in localStorage");
                return;
            }
            setYear(selectedYear);


            setLoadingCurrentYear(true); // Set loading state for current year when storage changes
            setLoadingFutureYear(true); // Set loading state for future year when storage changes

            // Call the appropriate API based on the selected year
            if (selectedYear < 2024) {
                fetchHistoricalYearData(districtId, selectedYear);
            } else {
                fetchFutureYearData(districtId, selectedYear);
            }
        };

        // Attach listener for storage changes
        window.addEventListener("storage", handleStorageChange);

        // Cleanup listener on component unmount
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <main className="flex flex-col justify-evenly items-center pt-5 bg-darkslateblue shadow-lg max-md:px-5 overflow-hidden">
            {/* Flex container for dropdowns */}
            <div className="flex flex-row justify-start items-center w-full">
                <FilterDropdown />
                {/* <DistrictDropdown /> */}
            </div>

            {/* First section */}
            <section className="flex flex-row w-full mt-8">
                <div className="flex flex-row w-full p-2">
                    <div className="flex flex-row w-full">
                        {/* Current  */}
                        <div className="flex flex-wrap pl-4">
                            <DataCard
                                title="Current Consumption (2024)"
                                value={currentYearData ? currentYearData.consumption.toFixed(2) : "N/A"}
                            />
                            <DataCard
                                title="Current Inflow (2024)"
                                value={currentYearData ? currentYearData.inflow.toFixed(2) : "N/A"}
                            />
                        </div>
                        <CurrentLinearGauge />
                    </div>
                    <div className="flex flex-row w-full">
                        {/* Past / Future */}
                        <div className="flex flex-wrap">
                            <DataCard
                                title={Year < 2024 ? `Past Year Consumption (${Year})` : `Future Year Consumption (${Year})`}
                                value={loadingFutureYear ? "Loading..." : (futureYearData ? futureYearData.consumption.toFixed(2) : "N/A")}
                            />
                            <DataCard
                                title={Year < 2024 ? `Past Year Inflow (${Year})` : `Future Year Inflow (${Year})`}
                                value={loadingFutureYear ? "Loading..." : (futureYearData ? futureYearData.inflow.toFixed(2) : "N/A")}
                            />
                        </div>
                        <LinearGauge />
                    </div>
                </div>
            </section>

            {/* Second section */}
            <section className="flex flex-row w-full">
                <div className="flex flex-row flex-1 p-3 gap-7">
                    <LucGraph />

                    <Months />
                </div>
            </section>

            {/* Third section */}
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
