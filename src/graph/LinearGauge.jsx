import React, { useEffect, useState } from 'react';
import waterUsageData from '../data/modified_usage_json_converted.json'; // Import your JSON file

const LinearGauge = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });
    const [usageData, setUsageData] = useState(null);
    const [percentages, setPercentages] = useState(null);
    const [title, setTitle] = useState('Water Usage Prediction');

    const fetchData = () => {
        try {
            const selectedState = parseInt(localStorage.getItem('selectedState'), 10);
            const selectedYear = parseInt(localStorage.getItem('selectedYear'), 10);
            const currentYear = new Date().getFullYear();

            if (!isNaN(selectedState) && !isNaN(selectedYear)) {
                let rawData;

                if (selectedYear < currentYear) {
                    setTitle('Past Water Usage'); // Title for past or current year
                } else {
                    setTitle('Water Usage Prediction'); // Title for future year
                }

                // Retrieve data from the JSON file
                const stateData = waterUsageData[selectedState];
                if (stateData) {
                    rawData = stateData[selectedYear];
                }

                if (!rawData) {
                    console.warn('Data not found for the selected state and year.');
                    setUsageData(null);
                    setPercentages(null);
                    return;
                }

                const mappedData = {
                    Domestic: rawData.Domestic,
                    Industrial: rawData.Industrial,
                    Irrigation: rawData.Irrigation,
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
            console.error('Error processing data:', error);
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
        <div className="w-11/12 mt-5 ml-5 p-5 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue rounded-3xl max-md:px-5 max-md:mt-3">
            <h2 className="mb-4 text-lg font-bold">Selected Water Usage Distribution</h2>
            {percentages ? (
                Object.entries(percentages).map(([category, percentage]) => (
                    <div key={category} className="flex items-center mb-4">
                        <span className=" text-sm font-bold">{category}: {percentage}%</span>

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

export default LinearGauge;
