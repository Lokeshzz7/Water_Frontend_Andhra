import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BASE_URL} from '../Config.js'

const WaterLinear = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });
    const [usageData, setUsageData] = useState(null);
    const [percentages, setPercentages] = useState(null);
    const [title, setTitle] = useState('Water Usage Prediction');

    const fetchData = async () => {
        try {
            const selectedState = parseInt(localStorage.getItem('selectedState'), 10);
            const selectedYear = parseInt(localStorage.getItem('selectedYear'), 10);
            const currentYear = new Date().getFullYear();

            if (!isNaN(selectedState) && !isNaN(selectedYear)) {
                let response, rawData;

                if (selectedYear < currentYear) {
                    setTitle('Past Water Usage');  // Title for past or current year
                } else {
                    setTitle('Water Usage Prediction');  // Title for future year
                }

                if (selectedYear >= currentYear) {
                    // POST request for future year
                    response = await axios.post(`${BASE_URL}/api/forecast/predict/`, {
                        state_idx: selectedState,
                        target_year: selectedYear,
                    });

                    rawData = response.data[selectedYear]; // Extract data for the selected year
                } else {
                    // GET request for past or current year
                    response = await axios.get(`${BASE_URL}/api/forecast/get_usage/${selectedState}/${selectedYear}`);
                    rawData = response.data;
                }

                const mappedData = {
                    Domestic: rawData.domestic || rawData.domestic_use,
                    Industrial: rawData.industrial || rawData.industrial_use,
                    Irrigation: rawData.irrigation || rawData.irrigation_use,
                };

                setUsageData(mappedData);

                // Calculate the total water usage
                const totalUsage = Object.values(mappedData).reduce((acc, value) => acc + value, 0);
                setWaterUsage({ title: 'Water Usage Prediction', value: totalUsage.toFixed(2) });

                // Calculate percentages for the linear gauge
                if (totalUsage > 0) {
                    const calculatedPercentages = Object.fromEntries(
                        Object.entries(mappedData).map(([key, value]) => [
                            key,
                            ((value / totalUsage) * 100).toFixed(2),
                        ])
                    );
                    setPercentages(calculatedPercentages);
                } else {
                    setPercentages(null);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data initially when component mounts

        const handleStorageChange = () => {
            fetchData(); // Re-fetch data if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div className="flex flex-col w-7/12 p-8 ">
            <div className="flex flex-col items-center w-full shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component p-6 rounded-lg shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)] ">
                {/* Water Usage Card Section */}
                <div className="flex flex-col w-full mb-8">
                    <div className="text-lg font-bold text-left">{title}</div>
                    <div className="flex justify-between items-end mt-3">
                        {/* Left Side: Water Usage Value and Unit */}
                        <div className="flex items-baseline">
                            <div className="text-8xl font-bold text-blue-500">{waterUsage.value}</div>
                            <div className="text-lg font-semibold text-gray-500 ml-2">galH<sub>2</sub>O</div>
                        </div>

                        {/* Right Side: Legend */}
                        <div className="flex flex-col space-y-2 items-end pr-5">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#4CAF50] rounded mr-2"></div>
                                <span className="text-lg text-gray-700">Domestic</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#f44336] rounded mr-2"></div>
                                <span className="text-lg text-gray-700">Industrial</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#00BCD4] rounded mr-2"></div>
                                <span className="text-lg text-gray-700">Irrigation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linear Gauge Section */}
                <div className="w-full">
                    <h2 className="mb-4 text-lg font-bold">Water Usage Distribution</h2>
                    {percentages ? (
                        Object.entries(percentages).map(([category, percentage]) => (
                            <div key={category} className="flex items-center mb-4">
                                <span className="ml-4 font-bold">{category}: {percentage}%</span>

                                <div className="bar w-full h-4 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="fill h-full rounded"
                                        style={{
                                            width: `${percentage}%`,
                                            background: {
                                                Domestic: '#4CAF50',
                                                Industrial: '#f44336',
                                                Irrigation: '#00BCD4',
                                            }[category],
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No data to display</p>
                    )}
                </div>
            </div>
        </div>
    );




};

export default WaterLinear;
