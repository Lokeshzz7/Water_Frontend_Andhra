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
            const districtId = localStorage.getItem('selectedDistrict'); // Get district ID from localStorage
            const year = localStorage.getItem('selectedYear'); // Get year from localStorage
            setYear(year);

            const state = parseInt(localStorage.getItem('selectedState'), 10);
            const selectedState = states.find(stateObj => stateObj.value === state);
            if (selectedState) {
                setStateName(selectedState.label);
            }

            if (!districtId || !year) {
                console.warn('District ID or year not found in localStorage.');
                return;
            }

            // Define common logic to call both APIs
            const fetchLandUseData = async (url) => {
                const response = await axios.get(url);
                return response.data[0]; // Assume we always get one object in the response
            };

            let data;
            const apiUrl = `http://127.0.0.1:8000/api/forecast/predict-luc/${districtId}/${year}/`;
            if (year < 2023) {
                // For years less than 2023, call the second API
                const landUseUrl = `http://127.0.0.1:8000/api/forecast/get_landuse/${districtId}/${year}/`;
                data = await fetchLandUseData(landUseUrl);
            } else {
                // For years 2023 and above, call the first API
                data = await fetchLandUseData(apiUrl);
            }

            const values = [
                { name: 'Built-up', value: data.built_up || 0 },
                { name: 'Agriculture', value: data.agriculture || 0 },
                { name: 'Forest', value: data.forest || 0 },
                { name: 'Wasteland', value: data.wasteland || 0 },
                { name: 'Wetlands', value: data.wetlands || 0 },
                { name: 'Waterbodies', value: data.waterbodies || 0 },
            ];

            const option = {
                backgroundColor: 'transparent', // Transparent background
                title: {
                    text: year > 2024 ? 'Predicted Land Use Change (LUC)' : 'Land Use Change (LUC)',
                    subtext: `Data for ${stateName}, Year ${year}`,
                    left: 'center',
                    top: '6%',
                    textStyle: {
                        color: '#ffffff',
                    },
                    subtextStyle: {
                        color: '#ffffff',
                    },
                },
                tooltip: {
                    trigger: 'item',
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: 'Save as Image',
                            name: `LUC_${stateName}_${year}`,
                            backgroundColor: 'transparent',
                        },
                    },
                    iconStyle: {
                        borderColor: '#ffffff',
                    },
                },
                legend: {
                    orient: 'vertical',
                    top: '5%',
                    right: '5%',
                    textStyle: {
                        color: '#ffffff',
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
                            color: '#ffffff',
                        },
                        labelLine: {
                            lineStyle: {
                                color: '#ffffff',
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
                    This graph shows the distribution of land use changes for the selected district and year.
                    <br /><hr />
                    <b>Built up</b><br />
                    Represents areas with human-made structures such as buildings, roads, and other infrastructure.
                    <br /><hr />
                    <b>Agriculture</b><br />
                    Covers land primarily used for farming activities, including crops and pastures.
                    <br /><hr />
                    <b>Forest</b><br />
                    Includes areas covered by dense vegetation and forests.
                    <br /><hr />
                    <b>Wasteland</b><br />
                    Refers to degraded or underutilized land that is not productive for agriculture or habitation.
                    {/* <br /><hr /> */}
                    {/* <b>Wetlands</b><br />
                    Encompasses water-saturated land such as marshes, swamps, and bogs.
                    <br /><hr /> */}
                    {/* <b>Waterbodies</b><br />
                    Includes lakes, rivers, reservoirs, and other permanent water features. */}
                </div>
            </div>
            <div id="lucChart" 
            className="w-[650px] ml-6  pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
            >

            </div>
        </div>
    );
};

export default LucGraph;
