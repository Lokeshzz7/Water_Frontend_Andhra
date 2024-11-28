import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import data from "../data/reservoir_fake_data.json"; // Replace with your actual JSON file

const WaterConsumptionGraph = () => {
    const [chartData, setChartData] = useState({
        years: [],
        waterStorage: [],
        waterCapacity: [],
        waterLevel: [],
        waterConsumption: [],
    });

    const fetchData = () => {
        const selectedYear = parseInt(localStorage.getItem("selectedYear") || 2020, 10);
        const selectedIndex = parseInt(localStorage.getItem("selectedState") || 0, 10);

        const years = Array.from({ length: 5 }, (_, i) => selectedYear - i).reverse();

        const filteredData = years.map((year) => {
            const yearData = data.find((item) => item.index === selectedIndex && item.year === year);
            return yearData || {};
        });

        const waterStorage = filteredData.map((item) => item.currentStorage || 0);
        const waterCapacity = filteredData.map((item) => item.currentCapacity || 0);
        const waterLevel = filteredData.map((item) => item.waterLevel || 0);
        const waterConsumption = filteredData.map((item) => item.consumption || 0);

        setChartData({
            years,
            waterStorage,
            waterCapacity,
            waterLevel,
            waterConsumption,
        });
    };

    useEffect(() => {
        fetchData();

        const handleStorageChange = () => {
            fetchData();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const chartDom = document.getElementById("water-consumption-chart");
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: "Water Consumption Trends",
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 24,
                },
                padding: [15, 0, 20, 110],
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["Water Storage", "Water Capacity", "Water Level", "Water Consumption"],
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                },
                top: "12%",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                top: "25%",
                containLabel: true,
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        backgroundColor: "transparent"
                    },
                },
                itemSize: 18,
                top: '1%',
                right: "2%",
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: chartData.years,
                axisLabel: {
                    color: "white",
                    fontWeight: "bold",
                },
                axisTick: {
                    alignWithLabel: true,
                    length: 5,
                },
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    color: "white",
                    fontWeight: "bold",
                    margin: 10,
                },
                axisTick: {
                    length: 5,
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "white",
                    },
                },
            },
            series: [
                {
                    name: "Water Storage",
                    type: "line",
                    data: chartData.waterStorage,
                },
                {
                    name: "Water Capacity",
                    type: "line",
                    data: chartData.waterCapacity,
                },
                {
                    name: "Water Level",
                    type: "line",
                    data: chartData.waterLevel,
                },
                {
                    name: "Water Consumption",
                    type: "line",
                    data: chartData.waterConsumption,
                },
            ],
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return (
        <div className="relative">
            {/* Tooltip Button */}
            <div
                className="absolute top-[30px] left-3 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('waterInfoTooltip'); // Updated id
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('waterInfoTooltip'); // Updated id
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
            </div>
            {/* Tooltip Content */}
            <div
                id="waterInfoTooltip" // Updated id
                className="absolute top-[70px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                style={{ display: 'none', width: '200px', pointerEvents: 'none' }}
            >
                This line chart shows the water storage, water capacity, water level, and consumption over the past years.
            </div>
            {/* Line Chart */}
            <div
                id="water-consumption-chart"
                className="w-full h-[500px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] rounded-lg ml-3 mt-8"
            ></div>
        </div>
    );
};

export default WaterConsumptionGraph;
