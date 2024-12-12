import React, { useEffect, useState } from 'react';

const LinearGauge = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });
    const [usageData, setUsageData] = useState(null);
    const [percentages, setPercentages] = useState(null);
    const [title, setTitle] = useState('Water Usage Prediction');
    const [loading, setLoading] = useState(false); // New state for loading
    const[month,setmonth]=useState(null);

    const fetchData = async () => {
        setLoading(true); // Set loading to true before the API call
        try {
            // Get necessary values from localStorage
            const districtId = localStorage.getItem('selectedDistrict'); // e.g., "25"
            const year = localStorage.getItem('selectedYear'); // e.g., "2024"
            const month = localStorage.getItem("selectedMonth"); // Get the selected month

            if (!districtId || !year || !month) {
                console.warn('District ID, year, or month not found in localStorage.');
                setUsageData(null);
                setPercentages(null);
                setLoading(false); // Set loading to false when data is not found
                return;
            }
            let apiUrl;
            // Set the title based on the year
            if (parseInt(year) <= 2024) {
                setTitle(` Water Usage Distribution (${year}-${month})`);
                apiUrl =  `http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${year}/`;

            } else {
                setTitle(`Water Usage Distribution (${year}-${month})`);
                apiUrl = `http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${year}/`;
            }

            // Determine which API endpoint to use based on the year
             

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

            // Process data to calculate totals for the selected month
            const monthData = data.find(item => item.month === parseInt(month)); // Find the selected month data
            if (!monthData) {
                console.error('No data found for the selected month.');
                setUsageData(null);
                setPercentages(null);
                setLoading(false);
                return;
            }
            console.log("Month data ; " , monthData);
            // Set the usage data f         or each category
            const { domestic, industry, irrigation, consumption } = monthData;
            setUsageData({
                Domestic: domestic,
                Industrial: industry,
                Irrigation: irrigation,
            });

            // Calculate the total consumption and percentages
            if (consumption > 0) {
                const calculatedPercentages = {
                    Domestic: ((domestic / consumption) * 100).toFixed(2),
                    Industrial: ((industry / consumption) * 100).toFixed(2),
                    Irrigation: ((irrigation / consumption) * 100).toFixed(2),
                };
                setPercentages(calculatedPercentages);
            } else {
                setPercentages(null);
            }

            // Set the water usage based on the total consumption for the selected month
            setWaterUsage({
                title: 'Total Water Consumption',
                value: consumption.toFixed(2),
            });
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
                    Object.entries(percentages).map(([category, percentage]) => {
                        // Get the exact value for each category
                        const value = usageData[category]; // This will give the exact value of the category
                        return (
                            <div key={category} className="flex items-center mb-8">
                                <span className="text-lg font-bold text-[#f19cbb]">
                                    {category}: {value} TMC ({percentage}%) {/* Show exact value and percentage */}
                                </span>

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
                        );
                    })
                ) : (
                    <p>No data to display</p>
                )
            )}
        </div>
    );
};

export default LinearGauge;
