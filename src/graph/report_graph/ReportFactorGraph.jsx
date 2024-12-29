import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import {BASE_URL} from '../../Config.js'

const FactorsGraph = () => {
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem('selectedYear') || '');
    const [description, setDescription] = useState('');
    const [insights, setInsights] = useState({
        interpretation: '',
        insights: '',
        recommendations: '',
    });

    // Function to generate description based on risk factors
    const getRiskFactorsDescription = (factors) => {
        return {
            interpretation: 'This bar chart shows the contribution of various factors to overall risk levels.',
            insights: 'Each factor contributes uniquely to the overall risk, and it is important to consider all factors for comprehensive risk management.',
            recommendations: 'Implement strategies to manage all contributing factors effectively and maintain a balanced approach.',
        };
    };

    const fetchData = async () => {
        const selectedDistrict = localStorage.getItem('selectedDistrict');
        const selectedMonth = localStorage.getItem('selectedMonth');
        const selectedYear = localStorage.getItem('selectedYear');

        try {
            // Fetch data for selected year
            const selectedYearResponse = await fetch(
                `${BASE_URL}/api/forecast/get-factors/${selectedDistrict}/${selectedYear}/${selectedMonth}/`
            );
            const selectedYearData = await selectedYearResponse.json();

            // Fetch data for 2024
            const year2024Response = await fetch(
                `${BASE_URL}/api/forecast/get-factors/${selectedDistrict}/2024/${selectedMonth}/`
            );
            const year2024Data = await year2024Response.json();

            // Extract relevant factors and calculate transformed values
            const factors = ['Rainfall', 'Built-Up', 'Forest', 'Agricultural'];
            const transformData = (data) => {
                const total = data[0] + data[4] + data[6] + data[5]; // Sum of relevant factors
                return {
                    Rainfall: data[0] / total,
                    'Built-Up': data[4] / total,
                    Forest: data[6] / total,
                    Agricultural: data[5] / total,
                };
            };

            const selectedYearTransformed = transformData(selectedYearData.weightage);
            const year2024Transformed = transformData(year2024Data.weightage);

            // Combine data for the chart
            const combinedData = factors.map((factor) => ({
                factor,
                [`value_${selectedYear}`]: selectedYearTransformed[factor],
                'value_2024': year2024Transformed[factor],
            }));

            // Update insights and description
            const riskDescription = getRiskFactorsDescription(combinedData);
            setDescription(riskDescription.interpretation);
            setInsights(riskDescription);

            // Initialize the chart
            const chartDom = document.getElementById('FactorMain');
            const myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: 'Factors',
                    left: 'center',
                    top: 5,
                    textStyle: {
                        color: '#ffffff',
                    },
                },
                legend: {
                    data: [selectedYear, '2024'],
                    textStyle: {
                        color: '#ffffff',
                    },
                    top: '30px',
                },
                tooltip: {
                    textStyle: {
                        color: 'black',
                    },
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: 'Save as Image',
                            pixelRatio: 2,
                            backgroundColor: '#0b1437',
                            iconStyle: {
                                borderColor: '#ffffff',
                            },
                        },
                    },
                    top: 10,
                    right: 10,
                },
                dataset: {
                    dimensions: ['factor', `value_${selectedYear}`, 'value_2024'],
                    source: combinedData,
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#ffffff',
                    },
                },
                yAxis: {
                    axisLabel: {
                        color: '#ffffff',
                    },
                },
                series: [
                    { type: 'bar', name: selectedYear },
                    { type: 'bar', name: '2024' },
                ],
            };

            myChart.setOption(option);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();

        return () => {
            const chartDom = document.getElementById('FactorMain');
            if (chartDom) {
                echarts.dispose(chartDom);
            }
        };
    }, [selectedYear]); // Re-run when selectedYear changes

    // Listen to localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedYear = localStorage.getItem('selectedYear');
            setSelectedYear(updatedYear);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="relative">
            <div
                className="absolute left-7 z-[100] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('factorTooltip');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('factorTooltip');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="factorTooltip"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    This graph shows the distribution of factors affecting risk for the selected district and year.
                </div>
            </div>

            <div
                id="FactorMain"
                className="w-[650px] ml-6 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
            ></div>

            {/* Insights and Recommendations Section */}
            <div>
                <h3>Insights for Graph</h3>
                <p>{insights.interpretation}</p>
                <p>{insights.insights}</p>
                <p>{insights.recommendations}</p>
            </div>
        </div>
    );
};

export default FactorsGraph;
