import React, { useState } from 'react';
import WaterUsageCard from './component/WaterUsageCard';
import WaterUsageChart from './component/WaterUsageChart';
import LucGraph from './graph/LucGraph';
import FilterDropdown from './component/FilterDropdown';  // Import FilterDropdown
import LinearGauge from './graph/LinearGauge';
import WaterLinear from './component/WaterLinear';
import PopulationWater from './graph/PopulationWater';
import WaterLinearCurrent from './component/WaterLinearCurrent';

function WaterManagementDashboard() {
    const [selectedData, setSelectedData] = useState([]);

    // Handle selected data from FilterDropdown
    const handleDataSelect = (data) => {
        setSelectedData(data);
    };

    return (
        <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
            <section className="mt-7 w-full max-w-[1700px] max-md:max-w-full">
                <div className="flex  max-md:flex-col">
                    {/* <WaterUsageCard /> */}
                    <WaterLinearCurrent />

                    <WaterLinear />



                    {/* <WaterUsageChart title="This month" value="35.25" percentage="+2.45%" status="On track" /> */}


                </div>
            </section>
            <section className="mt-17 w-full max-w-[1600px] max-md:max-w-full">
                <div className="flex gap-8 max-md:flex-col">
                    <LucGraph />

                    <PopulationWater />
                    {/* <LinearGauge /> */}
                </div>
            </section>
        </main>
    );
}

export default WaterManagementDashboard;
