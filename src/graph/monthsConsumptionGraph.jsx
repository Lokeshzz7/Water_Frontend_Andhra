import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

const MonthConsumptionGraph = () => {
    const [chartData, setChartData] = useState({});
    const [districtId, setDistrictId] = useState(localStorage.getItem('selectedDistrict'));
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem('selectedYear'));

    // Function to fetch and transform the data from the API
    const fetchMonthData = (districtId, selectedYear) => {
        fetch(`http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${selectedYear}`)
            .then((response) => response.json())
            .then((data) => {
                const months = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];

                const consumptionData = [];
                const inflowData = [];
                const irrigationData = [];
                const industryData = [];
                const domesticData = [];

                data.forEach((entry) => {
                    consumptionData.push(entry.consumption);
                    inflowData.push(entry.rainfall + entry.inflow_states);
                    irrigationData.push(entry.irrigation);
                    industryData.push(entry.industry);
                    domesticData.push(entry.domestic);
                });

                setChartData({
                    months,
                    consumptionData,
                    inflowData,
                    irrigationData,
                    industryData,
                    domesticData,
                });
            })
            .catch((error) => console.error("Error fetching month data:", error));
    };

    // Re-fetch data when districtId or selectedYear changes
    useEffect(() => {
        fetchMonthData(districtId, selectedYear);
    }, [districtId, selectedYear]);

    // Initialize ECharts and set option for the chart
    useEffect(() => {
        if (Object.keys(chartData).length === 0) return;

        const chartDom = document.getElementById('monthmain');
        const myChart = echarts.init(chartDom);

        const option = {
            backgroundColor: 'transparent',
            textStyle: {
                color: '#ffffff',
            },
            legend: {
                data: ['Consumption', 'Inflow', 'Irrigation', 'Industry', 'Domestic'],
                textStyle: {
                    color: '#ffffff',
                },
                top: '30px',
            },
            title: {
                text: `Consumption Data for ${selectedYear}`,
                textStyle: {
                    color: '#ffffff',
                },
                top: '5px',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                data: chartData.months,
                axisLabel: {
                    color: '#ffffff',
                },
            },
            yAxis: {
                name: 'Consumption / Inflow',
                nameLocation: 'middle', // Centers the label along the Y-axis
                nameRotate: 90, // Rotates the label vertically
                nameTextStyle: {
                    color: '#ffffff', // Sets the label color
                    fontSize: 14, // Optional: adjust font size
                },
                nameGap: 45,
                axisLabel: {
                    color: '#ffffff', // Sets the color of axis labels
                },
            },

            series: [
                {
                    name: 'Consumption',
                    type: 'line',
                    showSymbol: false,
                    data: chartData.consumptionData,
                    lineStyle: {
                        width: 2,
                    },
                },
                {
                    name: 'Inflow',
                    type: 'line',
                    showSymbol: false,
                    data: chartData.inflowData,
                    lineStyle: {
                        width: 2,
                    },
                },
                {
                    name: 'Irrigation',
                    type: 'line',
                    showSymbol: false,
                    data: chartData.irrigationData,
                    lineStyle: {
                        width: 2,
                    },
                },
                {
                    name: 'Industry',
                    type: 'line',
                    showSymbol: false,
                    data: chartData.industryData,
                    lineStyle: {
                        width: 2,
                    },
                },
                {
                    name: 'Domestic',
                    type: 'line',
                    showSymbol: false,
                    data: chartData.domesticData,
                    lineStyle: {
                        width: 2,
                    },
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true,
                        backgroundColor: 'transparent',
                        title: 'Save as Image',
                        iconStyle: {
                            borderColor: '#ffffff',
                        },
                    },
                },
            },
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return (
        <div className="relative">
            {/* Info button */}
            <div
                className="absolute left-7 z-[100] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('monthTooltip');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('monthTooltip');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="monthTooltip"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    This graph shows the distribution of consumption, inflow, and usage categories for the selected district and year.
                </div>
            </div>

            {/* Chart container */}
            <div
                id="monthmain"
                className="w-[655px] ml-2  pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
            ></div>
        </div>
    );
};

export default MonthConsumptionGraph;
