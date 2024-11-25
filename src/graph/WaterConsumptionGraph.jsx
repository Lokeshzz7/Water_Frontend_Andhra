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

        // Generate years for the current year and previous 4 years
        const years = Array.from({ length: 5 }, (_, i) => selectedYear - i).reverse();

        // Filter and collect data for the selected index and range of years
        const filteredData = years.map((year) => {
            const yearData = data.find((item) => item.index === selectedIndex && item.year === year);
            return yearData || {};
        });

        // Extract values for chart
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
        fetchData(); // Fetch data initially when component mounts

        const handleStorageChange = () => {
            fetchData(); // Re-fetch data if localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // Initialize the chart
        const chartDom = document.getElementById("water-consumption-chart");
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: "Water Consumption Trends",
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["Water Storage", "Water Capacity", "Water Level", "Water Consumption"],
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: chartData.years,
            },
            yAxis: {
                type: "value",
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

        // Cleanup on unmount
        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return <div id="water-consumption-chart" className="w-[650px] h-[454px] bg-white rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)]"></div>;
};

export default WaterConsumptionGraph;
