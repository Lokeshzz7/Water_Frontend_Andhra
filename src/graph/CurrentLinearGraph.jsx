import React, { useEffect, useState } from 'react';
import waterUsageData from '../data/modified_usage_json_converted.json'; // Import your JSON file

const CurrentLinearGauge = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });
    const [usageData, setUsageData] = useState(null);
    const [percentages, setPercentages] = useState(null);
    const [title, setTitle] = useState('Water Usage Prediction');

    const fetchData = async () => {
        try {
            // Get necessary values from localStorage
            const districtId = localStorage.getItem('selectedDistrict'); // e.g., "25"
            const year = localStorage.getItem('selectedYear'); // e.g., "2024"

            if (!districtId || !year) {
                console.warn('District ID or year not found in localStorage.');
                setUsageData(null);
                setPercentages(null);
                return;
            }

            const apiUrl = `http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/2024/`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();

            // Filter for month 1
            const januaryData = data.find(item => item.month === 1);

            if (!januaryData) {
                console.warn('Data for month 1 not found.');
                setUsageData(null);
                setPercentages(null);
                return;
            }

            // Extract relevant fields
            const mappedData = {
                Domestic: januaryData.domestic,
                Industrial: januaryData.industry,
                Irrigation: januaryData.irrigation,
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
        } catch (error) {
            console.error('Error fetching or processing data:', error);
            setUsageData(null);
            setPercentages(null);
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
        <div className="w-11/12  mt-8 mr-9 p-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-3xl max-md:px-5 max-md:mt-3">
            <h2 className="mb-4 text-xl font-bold mt-4 ">Selected Water Usage Distribution</h2>
            {percentages ? (
                Object.entries(percentages).map(([category, percentage]) => (
                    <div key={category} className="flex items-center mb-8 ">
                        <span className=" text-lg font-bold  text-[#f19cbb]">{category}: {percentage}%</span>

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
    );
};

export default CurrentLinearGauge;
