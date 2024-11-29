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
                // Filter the data to separate into categories for each country/region if necessary
                const months = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];

                const consumptionData = [];
                const inflowData = [];
                const irrigationData = [];
                const industryData = [];
                const domesticData = [];

                // Process the raw data into format usable for ECharts
                data.forEach((entry) => {
                    consumptionData.push(entry.consumption);
                    inflowData.push(entry.rainfall + entry.inflow_states);
                    irrigationData.push(entry.irrigation);
                    industryData.push(entry.industry);
                    domesticData.push(entry.domestic);
                });

                // Update the state with the chart data
                setChartData({
                    months: months,
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

        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);

        const option = {
            dataset: [
                {
                    id: 'dataset_raw',
                    source: chartData.months.map((month, index) => ({
                        Year: month,
                        Consumption: chartData.consumptionData[index],
                        Inflow: chartData.inflowData[index],
                        Irrigation: chartData.irrigationData[index],
                        Industry: chartData.industryData[index],
                        Domestic: chartData.domesticData[index],
                    }))
                },
                {
                    id: 'dataset_consumption',
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                            and: [{ dimension: 'Year', gte: 1950 }],
                        }
                    }
                }
            ],
            title: {
                text: `Consumption Data for ${selectedYear}`,
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                data: chartData.months,
            },
            yAxis: {
                name: 'Consumption / Inflow',
            },
            series: [
                {
                    type: 'line',
                    datasetId: 'dataset_consumption',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Consumption',
                        itemName: 'Year',
                        tooltip: ['Consumption'],
                    },
                },
                {
                    type: 'line',
                    datasetId: 'dataset_consumption',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Inflow',
                        itemName: 'Year',
                        tooltip: ['Inflow'],
                    },
                },
                {
                    type: 'line',
                    datasetId: 'dataset_consumption',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Irrigation',
                        itemName: 'Year',
                        tooltip: ['Irrigation'],
                    },
                },
                {
                    type: 'line',
                    datasetId: 'dataset_consumption',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Industry',
                        itemName: 'Year',
                        tooltip: ['Industry'],
                    },
                },
                {
                    type: 'line',
                    datasetId: 'dataset_consumption',
                    showSymbol: false,
                    encode: {
                        x: 'Year',
                        y: 'Domestic',
                        itemName: 'Year',
                        tooltip: ['Domestic'],
                    },
                }
            ],
        };

        myChart.setOption(option);

        // Clean up on component unmount
        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return (
        <div>
            <div id="main" className="w-[600px] ml-5 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component h-[454px] rounded-lg"></div>
        </div>
    );
};

export default MonthConsumptionGraph;
