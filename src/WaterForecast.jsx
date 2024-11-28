import React, { useState, useEffect } from "react";
import WaterUsageCard from "./component/WaterUsageCard";
import WaterUsageChart from "./component/WaterUsageChart";
import LucGraph from "./graph/LucGraph";
import LinearGauge from "./graph/LinearGauge";
import AndhraMap from "./map/AndhraMap.jsx";
import data from "../src/data/reservoir_fake_data.json";
import DataCard from "../src/component/DataCard.jsx";
import FilterDropdown from "./component/FilterDropdown.jsx";
import DistrictDropdown from "./component/Districtdropdown.jsx";

function WaterManagementDashboard() {


    return (
        <main className="flex flex-col justify-evenly items-center py-9 bg-darkslateblue shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] max-md:px-5 overflow-hidden">
            {/* Flex container for all dropdowns */}
            <div className="flex flex-row gap-5 justify-start items-center w-full px-4">
                {/* Existing Dropdowns (State and Year) */}
                <FilterDropdown />

                {/* District Dropdown */}
                <DistrictDropdown/>
            </div>

            {/* Remaining content */}
            <div className="flex flex-col justify-center items-center p-3 w-full">
                <section className="flex flex-row w-full">
                    <div className="flex flex-row w-full">
                        <div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-wrap px-4">
                                    <DataCard title="Current Usage" value={500} />
                                    <DataCard title="Past / Future Usage" value={400} />
                                </div>
                                <div>
                                    <LinearGauge />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-wrap px-4">
                                    <DataCard title="Current Usage" value={500} />
                                    <DataCard title="Past / Future Usage" value={400} />
                                </div>
                                <div>
                                    <LinearGauge />
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
                        <LucGraph />
                    </div>
                    <div className="flex flex-col flex-1 px-4">
                        <LucGraph />
                    </div>
                </section>
            </div>
        </main>
    );
}

export default WaterManagementDashboard;
