import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

const LucGraph = () => {
    const [stateName, setStateName] = useState('');
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
            const state = parseInt(localStorage.getItem('selectedState'), 10);
            const year = parseInt(localStorage.getItem('selectedYear'), 10);
            setYear(year);

            const selectedState = states.find(stateObj => stateObj.value === state);
            if (selectedState) {
                setStateName(selectedState.label);
            }

            if (!isNaN(state) && !isNaN(year)) {
                const response = await axios.get(`http://127.0.0.1:8000/api/forecast/get_landuse/${year}`);
                const stateData = response.data;

                const values = [
                    { name: 'Forest', value: stateData.forest_use || 0 },
                    { name: 'Barren', value: stateData.barren_use || 0 },
                    { name: 'Cropped', value: stateData.cropped_use || 0 },
                    { name: 'Fallow', value: stateData.fallow_use || 0 },
                    { name: 'Other', value: stateData.other_use || 0 },
                ];

                const option = {
                    backgroundColor: 'transparent', // Make the background transparent
                    title: {
                        text: 'Land Use Change (LUC)',
                        subtext: `Data for State Andra Pradesh, Year ${year}`,
                        left: 'center',
                        top: '6%',
                        textStyle: {
                            color: '#ffffff', // White text for contrast against the blue
                        },
                        subtextStyle: {
                            color: '#ffffff',
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        textStyle: {
                            color: 'black', // White text for tooltip
                        },
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {
                                title: 'Save as Image',
                                name: `LUC_${stateName}_${year}`,
                                backgroundColor: 'transparent', // Set save image background to transparent
                            },
                        },
                        iconStyle: {
                            borderColor: '#ffffff', // White border color for icons
                        },
                    },
                    legend: {
                        orient: 'vertical',
                        top: '5%',
                        right: '10%',
                        textStyle: {
                            color: '#ffffff', // White text for the legend
                        },
                    },
                    series: [
                        {
                            name: 'LUC Types',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '57%'],
                            data: values,
                            label: {
                                color: '#ffffff', // White label text
                            },
                            labelLine: {
                                lineStyle: {
                                    color: '#ffffff', // White label line color
                                },
                            },
                        },
                    ],
                };

                const chartDom = document.getElementById('lucChart');
                if (chartDom) {
                    const myChart = echarts.init(chartDom);
                    myChart.setOption(option);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        analyzeData();

        const handleStorageChange = () => {
            analyzeData();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [stateName, year]);

    return (
        <div className="relative">
            <div
                className="absolute left-7 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('infoTooltip');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('infoTooltip');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="infoTooltip"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    This graph shows the distribution of land use changes for the selected state and year.
                </div>
            </div>
            <div id="lucChart" className="w-11/12 ml-5 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component h-[454px] rounded-lg"></div>
        </div>
    );
};

export default LucGraph;
