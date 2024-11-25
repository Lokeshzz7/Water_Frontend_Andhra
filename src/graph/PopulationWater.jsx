import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';

const PopulationWater = () => {
    const [populationData, setPopulationData] = useState([]);
    const [waterData, setWaterData] = useState([]);
    const [chartData, setChartData] = useState({
        years: [],
        urbanPopulation: [],
        ruralPopulation: [],
        waterUsage: [], // Store water usage data here
    });

    // Fetch population data for the selected year and the previous 4 years
    const fetchPopulationData = async () => {
        try {
            const selectedYear = parseInt(localStorage.getItem('selectedYear'), 10);
            const yearsToFetch = Array.from({ length: 5 }, (_, index) => selectedYear - index);

            const populationPromises = yearsToFetch.map(year =>
                axios.get(`http://127.0.0.1:8000/api/forecast/get_population/${year}/`)
            );

            const responses = await Promise.all(populationPromises);

            const formattedData = responses.map((response, index) => {
                const { urban_population, rural_population } = response.data;
                return {
                    year: yearsToFetch[index],
                    urban: urban_population || 0,
                    rural: rural_population || 0,
                };
            });

            setPopulationData(formattedData);

            const urbanPop = formattedData.map(data => data.urban);
            const ruralPop = formattedData.map(data => data.rural);

            setChartData({
                years: yearsToFetch,
                urbanPopulation: urbanPop,
                ruralPopulation: ruralPop,
                waterUsage: [], // Initialize waterUsage as empty
            });

            fetchWaterUsageData(yearsToFetch); // Fetch water usage data after population data

        } catch (error) {
            console.error('Error fetching population data:', error);
        }
    };

    // Fetch water usage data
    const fetchWaterUsageData = async (yearsToFetch) => {
        try {
            const selectedState = localStorage.getItem('selectedState'); // Assuming state is saved in localStorage

            const waterPromises = yearsToFetch.map(year =>
                axios.get(`http://127.0.0.1:8000/api/forecast/get_usage/${selectedState}/${year}`)
            );

            const responses = await Promise.all(waterPromises);

            const waterUsageData = responses.map((response, index) => {
                const { domestic_use, industrial_use, irrigation_use } = response.data;

                // Sum the water usage categories for each year
                const totalWaterUsage = ((domestic_use || 0) + (industrial_use || 0) + (irrigation_use || 0)) * 3.78541;
                return totalWaterUsage;
            });

            setWaterData(waterUsageData);

            // Update chart data with the water usage data
            setChartData(prevData => ({
                ...prevData,
                waterUsage: waterUsageData,
            }));

            console.log('Water Usage Data:' + waterUsageData);

        } catch (error) {
            console.error('Error fetching water usage data:', error);
        }
    };

    useEffect(() => {
        fetchPopulationData(); // Fetch data when component mounts

        // Listen for changes in localStorage (year or state change)
        const handleStorageChange = () => {
            fetchPopulationData();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Only on mount

    useEffect(() => {
        // Initialize chart only when data is available
        if (chartData.years.length > 0) {
            const chartDom = document.getElementById('main');
            const myChart = echarts.init(chartDom);

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999',
                        },
                    },
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    },
                },
                legend: {
                    data: ['Urban Population', 'Rural Population', 'Total Water Usage'],
                },
                xAxis: [
                    {
                        type: 'category',
                        data: chartData.years,
                        axisPointer: {
                            type: 'shadow',
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Population',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}',
                        },
                    },
                    {
                        type: 'value',
                        name: 'Water Usage (L)',
                        min: 0,
                        max: 100,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value} L',
                        },
                    },
                ],
                series: [
                    {
                        name: 'Urban Population',
                        type: 'bar',
                        data: chartData.urbanPopulation,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' people';
                            },
                        },
                    },
                    {
                        name: 'Rural Population',
                        type: 'bar',
                        data: chartData.ruralPopulation,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' people';
                            },
                        },
                    },
                    {
                        name: 'Total Water Usage',
                        type: 'line',
                        yAxisIndex: 1,
                        data: chartData.waterUsage,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' L';
                            },
                        },
                    },
                ],
            };

            myChart.setOption(option);
        }
    }, [chartData]); // Re-render chart when chartData changes

    return (
        <div
            id="main"
            className="w-1/2 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue h-[454px] rounded-lg mt-8 mr-5 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)] "
        ></div>
    );
};

export default PopulationWater;
