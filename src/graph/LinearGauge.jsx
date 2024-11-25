import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LinearGauge = () => {
    const [percentages, setPercentages] = useState(null);
    const [usageData, setUsageData] = useState(null);

    const fetchData = async () => {
        try {
            const state = parseInt(localStorage.getItem('selectedState'), 10);
            const year = parseInt(localStorage.getItem('selectedYear'), 10);
            const currentYear = new Date().getFullYear();  // Get the current year

            console.log("Retrieved from localStorage - State:", state, "Year:", year);

            if (!isNaN(state) && !isNaN(year)) {
                let response;
                let rawData;

                if (year >= currentYear) {
                    // Make a POST request for the future year
                    response = await axios.post("http://127.0.0.1:8000/api/forecast/predict/", {
                        state_idx: state,
                        target_year: year,
                    });

                    rawData = response.data;
                    console.log("POST response:", rawData);
                    console.log('Future year prediction');

                    // Extract and map data from response for future year
                    const yearData = rawData[year]; // Assuming the response has the year as a key
                    const mappedData = {
                        Domestic: yearData.domestic,
                        Industrial: yearData.industrial,
                        Irrigation: yearData.irrigation,
                    };

                    setUsageData(mappedData);

                } else {
                    // Make a GET request for the past or current year
                    response = await axios.get(`http://127.0.0.1:8000/api/forecast/get_usage/${state}/${year}`);
                    rawData = response.data;
                    console.log("GET response:", rawData);
                    console.log('Past or current year water usage');

                    // Map the data for the past/current year
                    const mappedData = {
                        Domestic: rawData.domestic_use,
                        Industrial: rawData.industrial_use,
                        Irrigation: rawData.irrigation_use,
                    };

                    setUsageData(mappedData);
                }

                console.log("Mapped Data:", usageData);

            } else {
                console.warn("Invalid state or year values in localStorage");
                setUsageData(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    const analyzeData = () => {
        if (usageData) {
            const total = Object.values(usageData).reduce((acc, value) => acc + value, 0);
            if (total > 0) {
                const calculatedPercentages = Object.fromEntries(
                    Object.entries(usageData).map(([key, value]) => [
                        key,
                        ((value / total) * 100).toFixed(2),
                    ])
                );
                setPercentages(calculatedPercentages);
                console.log("Calculated Percentages:", calculatedPercentages);
            } else {
                setPercentages(null);
            }
        } else {
            setPercentages(null);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data initially when component mounts

        // Re-run analyzeData whenever usageData changes
        if (usageData) {
            analyzeData();
        }

        const handleStorageChange = () => {
            fetchData();  // Re-fetch data if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [usageData]);

    return (
        <div className="flex gap-8 p-8 bg-gray-100">
            <div className="w-[600px]">
                <div className="progress-container bg-white text-black p-6 rounded-lg shadow-lg">
                    <h2 className="mb-4 text-lg font-bold">Water Usage Distribution</h2>
                    {percentages ? (
                        Object.entries(percentages).map(([category, percentage]) => (
                            <div key={category} className="flex items-center mb-4">
                                <div className="bar w-full h-4 bg-gray-800 rounded overflow-hidden">
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
                                <span className="ml-4">{category}: {percentage}%</span>
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

export default LinearGauge;
