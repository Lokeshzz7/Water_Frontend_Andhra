import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

const RainfallGraph = () => {
    const [districtId, setDistrictId] = useState(localStorage.getItem('selectedDistrict'));
    const [year, setYear] = useState(localStorage.getItem('selectedYear'));
    const [chartKey, setChartKey] = useState(0); // Used to force component remount

    // Fetch and render chart data when districtId or year changes
    useEffect(() => {
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);

        const fetchRainfallData = async () => {
            try {
                if (!districtId || !year) {
                    console.warn('No district or year found in localStorage');
                    return;
                }

                const apiUrl = `http://127.0.0.1:8000/api/forecast/get-rainfall/${districtId}/${year}`;
                const response = await axios.get(apiUrl);
                const data = response.data;

                const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const option = {
                    title: {
                        text: `Normal and Actual Rainfall for ${year}`,
                        left: 'center',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 18,
                            fontWeight: 'bold',
                        },
                        top: 10,
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#ffffff',
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    legend: {
                        data: ['Normal Rainfall', 'Actual Rainfall'],
                        textStyle: {
                            color: '#ffffff',
                        },
                        top: 50,
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
                    grid: {
                        top: 100,
                        left: '10%',
                        right: '10%',
                        bottom: '10%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        data: months,
                        axisLabel: {
                            color: '#ffffff',
                            interval: 0,
                            rotate: 45,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff',
                            },
                        },
                    },
                    yAxis: {
                        name: 'Rainfall (mm)',
                        nameTextStyle: {
                            color: '#ffffff',
                        },
                        type: 'value',
                        axisLabel: {
                            color: '#ffffff',
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                            },
                        },
                    },
                    series: [
                        {
                            name: 'Normal Rainfall',
                            type: 'line',
                            data: data.map(item => item.normal),
                            itemStyle: {
                                color: '#1E90FF',
                            },
                            lineStyle: {
                                color: '#1E90FF',
                                width: 3,
                            },
                            smooth: true,
                        },
                        {
                            name: 'Actual Rainfall',
                            type: 'line',
                            data: data.map(item => item.actual),
                            itemStyle: {
                                color: '#008080',
                            },
                            lineStyle: {
                                color: '#008080',
                                width: 3,
                            },
                            smooth: true,
                        },
                    ],
                };

                myChart.setOption(option);
            } catch (error) {
                console.error('Error fetching rainfall data:', error);
            }
        };

        fetchRainfallData();

        return () => {
            myChart.dispose();
        };
    }, [districtId, year]); // Depend on districtId and year to trigger re-renders

    // Listen for changes in localStorage and update state
    useEffect(() => {
        const handleStorageChange = () => {
            const newDistrictId = localStorage.getItem('selectedDistrict');
            const newYear = localStorage.getItem('selectedYear');

            if (newDistrictId !== districtId) {
                setDistrictId(newDistrictId);
                setChartKey(prevKey => prevKey + 1); // Trigger a re-render
            }

            if (newYear !== year) {
                setYear(newYear);
                setChartKey(prevKey => prevKey + 1); // Trigger a re-render
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [districtId, year]); // Watch for districtId and year changes

    return (
        <div key={chartKey} className="relative">
            {/* Info button */}
            <div
                className="absolute left-7 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('rainfallTooltip');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('rainfallTooltip');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="rainfallTooltip"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    This graph shows the distribution of rainfall for the selected district and year.
                </div>
            </div>

            {/* Chart container */}
            <div
                id="main"
                className="w-11/12 ml-5 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[454px] rounded-lg"
            ></div>
        </div>
    );
};

export default RainfallGraph;
