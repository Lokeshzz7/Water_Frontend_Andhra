import React, { useEffect, useState } from 'react';

const LinearGauge = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });
    const [usageData, setUsageData] = useState(null);
    const [percentages, setPercentages] = useState(null);
    const [title, setTitle] = useState('Water Usage Prediction');
    const [loading, setLoading] = useState(false); // New state for loading

    const fetchData = async () => {
        setLoading(true); // Set loading to true before the API call
        try {
            // Get necessary values from localStorage
            const districtId = localStorage.getItem('selectedDistrict'); // e.g., "25"
            const year = localStorage.getItem('selectedYear'); // e.g., "2024"

            if (!districtId || !year) {
                console.warn('District ID or year not found in localStorage.');
                setUsageData(null);
                setPercentages(null);
                setLoading(false); // Set loading to false when data is not found
                return;
            }

            // Set the title based on the year
            if (parseInt(year) < 2024) {
                setTitle(`Past Water Usage Distribution (${year})`);
            } else {
                setTitle(`Predicted Water Usage Distribution (${year})`);
            }

            // Determine which API endpoint to use based on the year
            const apiUrl = year < 2024
                ? `http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${year}/`
                : `http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${year}/`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                console.warn('No data returned from API.');
                setUsageData(null);
                setPercentages(null);
                setLoading(false); // Set loading to false when data is not returned
                return;
            }

            // Initialize the totals and month counter
            const totalData = {
                Domestic: 0,
                Industrial: 0,
                Irrigation: 0,
            };
            let monthCount = 0;

            // Process data to calculate totals and count months
            data.forEach((entry) => {
                totalData.Domestic += entry.domestic || 0;
                totalData.Industrial += entry.industry || 0;
                totalData.Irrigation += entry.irrigation || 0;
                monthCount++;
            });

            // Calculate average per category
            const averageData = {
                Domestic: (totalData.Domestic / monthCount).toFixed(2),
                Industrial: (totalData.Industrial / monthCount).toFixed(2),
                Irrigation: (totalData.Irrigation / monthCount).toFixed(2),
            };

            setUsageData(averageData);

            // Calculate the total average usage
            const totalUsage = Object.values(averageData).reduce((acc, value) => acc + parseFloat(value), 0);
            setWaterUsage({ title: 'Average Water Usage', value: totalUsage.toFixed(2) });

            // Calculate percentages for the linear gauge
            if (totalUsage > 0) {
                const calculatedPercentages = Object.fromEntries(
                    Object.entries(averageData).map(([key, value]) => [
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
        } finally {
            setLoading(false); // Set loading to false after the fetch is complete
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
        <div className="w-11/12 mr-10 mt-8 p-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-3xl max-md:px-5 max-md:mt-3">
            <h2 className="mb-6 text-xl font-bold mt-3">{title}</h2>
            {loading ? (
                <p>Loading...</p> // Show loading message if loading is true
            ) : (
                percentages ? (
                    Object.entries(percentages).map(([category, percentage]) => (
                        <div key={category} className="flex items-center mb-8">
                            <span className="text-lg font-bold text-[#f19cbb]">{category}: {percentage}%</span>

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
                )
            )}
        </div>
    );
};

export default LinearGauge;
