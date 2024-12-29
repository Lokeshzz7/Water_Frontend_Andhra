import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';
import {BASE_URL} from '../../Config.js'

const ReportLucGraph = () => {
    const [stateName, setStateName] = useState('');
    const [year, setYear] = useState(null);
    const [riskScore, setRiskScore] = useState(0); // Track the risk score or similar metric.
    const [insights, setInsights] = useState({
        interpretation: '',
        insights: '',
        recommendations: ''
    }); // Store insights data

    const states = [
        { label: 'Arunachal Pradesh', value: 1 },
        { label: 'Odisha', value: 2 },
        // Add the rest of your states here
    ];

    const analyzeData = async () => {
        try {
            const districtId = localStorage.getItem('selectedDistrict');
            const year = localStorage.getItem('selectedYear');
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

            const fetchLandUseData = async (url) => {
                const response = await axios.get(url);
                return response.data[0];
            };

            let data;
            const apiUrl = `${BASE_URL}/api/forecast/predict-luc/${districtId}/${year}/`;
            if (year < 2023) {
                const landUseUrl = `${BASE_URL}/api/forecast/get_landuse/${districtId}/${year}/`;
                data = await fetchLandUseData(landUseUrl);
            } else {
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

            // Calculate a simple "risk score" based on land use values
            const totalLandUse = values.reduce((acc, val) => acc + val.value, 0);
            const risk = (values.find(val => val.name === 'Wasteland')?.value || 0) / totalLandUse;
            setRiskScore(risk);

            // Setting insights
            setInsights({
                interpretation: 'This chart represents the distribution of land use types for the selected district in 2027. It highlights key land use categories like Built-up areas, Agriculture, Forest, and Wasteland.',
                insights: `The highest land use category is Agriculture, followed by Built-up areas. Wasteland occupies a significant portion of the land, signaling a potential concern for future land development or reclamation efforts.`,
                recommendations: 'Focus on reclaiming Wasteland areas and converting them into productive agricultural or forested areas. Implement urban planning strategies that prevent further loss of agricultural land.'
            });

            const option = {
                backgroundColor: 'transparent',
                title: {
                    text: year > 2024 ? 'Predicted Land Use Change (LUC)' : 'Land Use Change (LUC)',
                    subtext: `Data for ${stateName}, Year ${year}`,
                    left: 'center',
                    top: '6%',
                    textStyle: { color: '#ffffff' },
                    subtextStyle: { color: '#ffffff' },
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
                    textStyle: { color: '#ffffff' },
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
                </div>
            </div>
            <div id="lucChart"
                className="w-[650px] ml-6 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg">
            </div>



            {/* Displaying the analysis */}
            <div className="ml-6 mt-4 text-white p-4 bg-[#1a2238] rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Analysis Summary</h3>
                <p>
                    <b>Interpretation:</b> {insights.interpretation}
                </p>
                <p>
                    <b>Insights:</b> {insights.insights}
                </p>
            </div>
        </div>
    );
};

export default ReportLucGraph;
