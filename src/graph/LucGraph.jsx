import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

const LucGraph = () => {
    const [stateName, setStateName] = useState('');  // State to hold the name of the state
    const [year, setYear] = useState(null);

    const states = [
        { label: 'Arunachal Pradesh', value: 1 },
        { label: 'Odisha', value: 2 },
        { label: 'Manipur', value: 3 },
        { label: 'Rajasthan', value: 4 },
        { label: 'Bihar', value: 5 },
        { label: 'Telangana', value: 6 },
        { label: 'Puducherry', value: 7 },
        { label: 'Lakshadweep', value: 8 },
        { label: 'Ladakh', value: 9 },
        { label: 'Kerala', value: 10 },
        { label: 'Andaman and Nicobar Islands', value: 11 },
        { label: 'Maharashtra', value: 12 },
        { label: 'Uttar Pradesh', value: 13 },
        { label: 'Mizoram', value: 14 },
        { label: 'Uttarakhand', value: 15 },
        { label: 'Andhra Pradesh', value: 16 },
        { label: 'Haryana', value: 17 },
        { label: 'Dadra and Nagar Haveli', value: 18 },
        { label: 'Himachal Pradesh', value: 19 },
        { label: 'Karnataka', value: 20 },
        { label: 'Jammu and Kashmir', value: 21 },
        { label: 'Chhattisgarh', value: 22 },
        { label: 'Meghalaya', value: 23 },
        { label: 'Delhi', value: 24 },
        { label: 'Tripura', value: 25 },
        { label: 'West Bengal', value: 26 },
        { label: 'Assam', value: 27 },
        { label: 'Madhya Pradesh', value: 28 },
        { label: 'Nagaland', value: 29 },
        { label: 'Goa', value: 30 },
        { label: 'Daman and Diu', value: 31 },
        { label: 'Jharkhand', value: 32 },
        { label: 'Sikkim', value: 33 },
        { label: 'Tamil Nadu', value: 34 },
        { label: 'Gujarat', value: 35 },
        { label: 'Punjab', value: 36 }
    ];

    const analyzeData = async () => {
        try {
            // Retrieve state and year from localStorage
            const state = parseInt(localStorage.getItem('selectedState'), 10);
            const year = parseInt(localStorage.getItem('selectedYear'), 10);
            setYear(year);

            console.log("Retrieved from localStorage - State:", state, "Year:", year);

            // Find the state name from the `states` array
            const selectedState = states.find(stateObj => stateObj.value === state);
            if (selectedState) {
                setStateName(selectedState.label); // Set the state name to the stateName state
            }

            if (!isNaN(state) && !isNaN(year)) {
                // Fetch data using the correct API endpoint
                const response = await axios.get(`http://127.0.0.1:8000/api/forecast/get_landuse/${state}/${year}`);

                console.log("API Response:", response.data);

                if (response.data) {
                    const stateData = response.data;  // Directly access the response object
                    console.log("Fetched Data:", stateData);

                    // Convert the data into a format suitable for echarts (Pie chart format)
                    const values = [
                        { name: 'Forest', value: stateData.forest_use || 0 },
                        { name: 'Barren', value: stateData.barren_use || 0 },
                        { name: 'Cropped', value: stateData.cropped_use || 0 },
                        { name: 'Fallow', value: stateData.fallow_use || 0 },
                        { name: 'Other', value: stateData.other_use || 0 },
                    ];

                    // Set the chart options dynamically
                    const option = {
                        title: {
                            text: 'Land Use Change (LUC)',
                            subtext: `Data for State ${stateName}, Year ${year}`,  // Use stateName here
                            left: 'center',
                            top: '6%',
                        },
                        tooltip: {
                            trigger: 'item',
                        },
                        legend: {
                            orient: 'vertical',
                            top: '5%',
                            right: '10%',
                        },
                        series: [
                            {
                                name: 'LUC Types',
                                type: 'pie',
                                radius: '60%',
                                center: ['50%', '57%'],
                                data: values,  // Use the dynamically fetched data
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    },
                                },
                            },
                        ],
                    };

                    // Initialize the chart
                    const chartDom = document.getElementById('lucChart');  // Get the DOM element for the chart
                    if (chartDom) {
                        const myChart = echarts.init(chartDom);
                        myChart.setOption(option);  // Set the options
                    }
                } else {
                    console.warn("No data found for the specified state and year.");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        analyzeData(); // Initial load

        // Listen to `storage` event for changes in `selectedState` or `selectedYear`
        const handleStorageChange = () => {
            analyzeData();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [stateName , year]);  // Add stateName as a dependency to trigger re-render

    return (
        <div id="lucChart" className="w-11/12 ml-5  shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue h-[454px] rounded-lg   "></div>  // The chart container where the graph will be displayed
    );
};

export default LucGraph;
