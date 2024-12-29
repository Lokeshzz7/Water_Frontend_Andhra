import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {BASE_URL} from '../Config.js'

// WaterUsageCard Component
const WaterUsageCard = () => {
    const [waterUsage, setWaterUsage] = useState({ title: 'Water Usage Prediction', value: 0 });  // State to hold title and value

    const fetchData = async () => {
        try {
            const selectedState = localStorage.getItem('selectedState');
            const selectedYear = localStorage.getItem('selectedYear');
            const currentYear = new Date().getFullYear();

            if (selectedState && selectedYear) {
                let data;

                if (parseInt(selectedYear) >= currentYear) {
                    // Make a POST request if the selected year is in the future
                    const response = await axios.post(`${BASE_URL}/api/forecast/predict/`, {
                        state_idx: selectedState,
                        target_year: selectedYear,
                    });

                    data = response.data;
                    console.log(data);
                    console.log('post');
                    const yearData = data[selectedYear]; // Extract the data for the selected year

                    // Calculate the sum of domestic, industrial, and irrigation usage
                    const predictionSum = Object.values({
                        domestic: yearData.domestic,
                        industrial: yearData.industrial,
                        irrigation: yearData.irrigation,
                    }).reduce((acc, value) => acc + value, 0);

                    // Set the water usage prediction
                    setWaterUsage({
                        title: 'Water Usage Prediction',
                        value: predictionSum.toFixed(2)
                    });
                } else {
                    // Make a GET request if the selected year is in the past or the current year
                    const response = await axios.get(`${BASE_URL}/api/forecast/get_usage/${selectedState}/${selectedYear}`);
                    const data = response.data;
                    console.log(data);
                    console.log('get water usage');
                    // Calculate the sum of domestic, industrial, and irrigation usage
                    const predictionSum = Object.values({
                        domestic: data.domestic_use,
                        industrial: data.industrial_use,
                        irrigation: data.irrigation_use,
                    }).reduce((acc, value) => acc + value, 0);

                    // Set the water usage prediction
                    setWaterUsage({
                        title: 'Water Usage Prediction',
                        value: predictionSum.toFixed(2)
                    });
                }


            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Listen to `storage` event for changes in `selectedState` or `selectedYear`
        const handleStorageChange = () => {
            fetchData();  // Re-fetch data if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
    return (
        <div className="flex flex-col w-5/12 h-full ml-[30px] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col justify-center file:w-full h-full rounded-3xl shadow-[12px_13px_26px_rgba(0,122,255,0.46)] max-md:mt-10 max-md:max-w-full">
                {/* NUMBER */}
                <div className="pt-2 pr-8 pl-8 max-w-full shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component w-[654px] max-md:px-5 max-md:pb-24">
                    <div className="flex gap-5 max-md:flex-col">
                        <div className="flex flex-col w-[55%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col mt-2 max-md:mt-10">
                                <div className="self-start text-xs text-slate-400 max-md:ml-2">{waterUsage.title}</div>
                                <div className="mt-3 text-8xl font-bold text-blue-500 max-md:text-4xl">{waterUsage.value}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col py-3 pl-4 w-full font-medium shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component max-w-[654px] shadow-[0px_4px_10px_rgba(80,80,80,0.05)] max-md:max-w-full">
                    <div className="flex gap-5 justify-between max-w-full text-sm text-white w-[229px]">
                        <div>Sector</div>
                        <div>Water use</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterUsageCard;
