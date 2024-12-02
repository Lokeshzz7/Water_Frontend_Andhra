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

    const fetchFutureYearData = (districtId, selectedYear) => {
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${selectedYear}`)
            .then((response) => response.json())
            .then((data) => {
                const januaryData = data.find((entry) => entry.month === 1);
                if (januaryData) {
                    setFutureYearData({
                        consumption: januaryData.consumption,
                        inflow: januaryData.rainfall + januaryData.inflow_states,
                    });
                }
            })
            .catch((error) => console.error("Error fetching future year data:", error));
    };

    useEffect(() => {
        const districtId = localStorage.getItem("selectedDistrict");
        const selectedYear = localStorage.getItem("selectedYear");

        // Fetch data for 2024 (Static, fetched only once)
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/2024`)
            .then((response) => response.json())
            .then((data) => {
                const januaryData = data.find((entry) => entry.month === 1);
                if (januaryData) {
                    setCurrentYearData({
                        consumption: januaryData.consumption,
                        inflow: januaryData.rainfall + januaryData.inflow_states,
                    });
                }
            })
            .catch((error) => console.error("Error fetching current year data:", error));

        // Initial fetch for future year data
        fetchFutureYearData(districtId, selectedYear);
    }, []); // Run only on component mount

    useEffect(() => {
        const handleStorageChange = () => {
            const districtId = localStorage.getItem("selectedDistrict");
            const selectedYear = localStorage.getItem("selectedYear");

            // Fetch updated data for the future year only
            if (districtId && selectedYear) {
                fetchFutureYearData(districtId, selectedYear);
            }
        };

        // Attach listener for storage changes
        window.addEventListener("storage", handleStorageChange);

        // Cleanup listener on component unmount
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <main className="flex flex-col justify-evenly items-center pt-5  bg-darkslateblue shadow-lg max-md:px-5 overflow-hidden">
            {/* Flex container for dropdowns */}
            <div className="flex flex-row justify-start items-center w-full">
                <FilterDropdown />
                {/* <DistrictDropdown /> */}
            </div>

            {/* First section */}
            <section className="flex flex-row w-full mt-8">
                <div className="flex flex-row w-full p-2  ">
                    <div className="flex flex-row w-full">
                        <div className="flex flex-wrap pl-4 ">
                            <DataCard
                                title="Current Consumption (2024)"
                                value={currentYearData ? currentYearData.consumption.toFixed(2) : "Loading..."}
                            />
                            <DataCard
                                title="Current Inflow (2024)"
                                value={currentYearData ? currentYearData.inflow.toFixed(2) : "Loading..."}
                            />
                        </div>
                        <CurrentLinearGauge />
                    </div>
                    <div className="flex flex-row w-full ">
                        <div className="flex flex-wrap   ">
                            <DataCard
                                title="Future Consumption"
                                value={futureYearData ? futureYearData.consumption.toFixed(2) : "Loading..."}
                            />
                            <DataCard
                                title="Future Inflow"
                                value={futureYearData ? futureYearData.inflow.toFixed(2) : "Loading..."}
                            />
                        </div>
                        <LinearGauge />
                    </div>
                </div>
            </section>

            {/* Second section */}
            <section className="flex flex-row w-full  ">
                <div className="flex flex-row flex-1 p-3 gap-7   ">
                    <FactorsAffectingGraph />
                    <Months />
                </div>
            </section>

            {/* Third section */}
            <section className="flex flex-row w-full  ">
                <div className="flex flex-row flex-1 p-3 gap-7 ">
                    <LucGraph />

                    <RainfallGraph />
                </div>
            </section>
        </main>
    );
}

export default WaterManagementDashboard;
