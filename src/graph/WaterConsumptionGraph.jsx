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
                textStyle: {
                    color: "white", // Set title color to white
                    fontWeight: "bold", // Set title font weight to bold
                    fontSize: 24, // Optional: Set title font size
                },
                padding: [15, 0, 20, 20], // Add padding below the title (top, right, bottom, left)
            },
            tooltip: {
                trigger: "axis",
            },
            legend: {
                data: ["Water Storage", "Water Capacity", "Water Level", "Water Consumption"],
                textStyle: {
                    color: "white", // Set legend text color to white
                    fontWeight: "bold", // Set legend text to bold
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
                itemSize: 18, // Optional: Adjust the size of toolbox icons
                top: '1%',// Position the toolbox from the top (you can adjust this)
                right: "2%",
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: chartData.years,
                axisLabel: {
                    color: "white", // Set x-axis label color to white
                    fontWeight: "bold", // Make x-axis labels bold
                },
                axisTick: {
                    alignWithLabel: true, // Align ticks with labels
                    length: 5, // Make ticks shorter
                },
            },
            yAxis: {
                type: "value",
                axisLabel: {
                    color: "white", // Set y-axis label color to white
                    fontWeight: "bold", // Make y-axis labels bold
                    margin: 10,
                },
                axisTick: {
                    length: 5, // Make ticks shorter
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed", // Optional: Change split line style
                        color: "white", // Set split line color to white
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

        // Cleanup on unmount
        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return <div id="water-consumption-chart" className="w-[650px] h-[454px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)] "></div>;
};

export default WaterConsumptionGraph;
