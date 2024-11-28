import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import data from "../data/reservoir_fake_data.json"; // Replace with the correct JSON file name

const SpiderGraph = () => {
    const [usageData, setUsageData] = useState(null);

    const fetchData = () => {
        const index = parseInt(localStorage.getItem("selectedState") || 0, 10);
        const year = parseInt(localStorage.getItem("selectedYear") || 2000, 10);

        // Filter data based on the state and year
        const filteredData = data.find(
            (item) => item.index === index && item.year === year
        );

        if (!filteredData) {
            console.error("No matching data found for the selected state, index, or year.");
            setUsageData(null);
            return;
        }

        setUsageData(filteredData);
    };

    const analyzeData = () => {
        if (!usageData) return;

        const indicators = [
            { name: "Domestic Use", max: 100 },
            { name: "Other", max: 100 },
            { name: "Hydroelectric Power Generation", max: 500 },
            { name: "Industrial Use", max: 100 },
            { name: "Irrigation", max: 200 },
        ];

        const values = [
            usageData.domesticUse,
            usageData.other,
            usageData.hydroelectricPowerGeneration,
            usageData.industrialUse,
            usageData.irrigation,
        ];

        const chartDom = document.getElementById("spider-chart");
        if (!chartDom) return; // Ensure the DOM is available before initializing the chart
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: "Water Usage Radar Chart",
                left: "center",
                top: "5%",
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                },
            },
            tooltip: {},
            legend: {
                data: ["Water Usage"],
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                },
                orient: "vertical",
                right: "2%",
                top: "20%",
            },
            radar: {
                indicator: indicators,
                radius: "60%",
                center: ["50%", "55%"],
                axisLabel: {
                    textStyle: {
                        color: "white",
                        fontWeight: "bold",
                    },
                },
            },
            series: [
                {
                    name: "Water Usage",
                    type: "radar",
                    data: [
                        {
                            value: values,
                            name: "Water Usage",
                        },
                    ],
                },
            ],
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        backgroundColor: "transparent"
                    },
                },
                itemSize: 18,
                top: '1%',
                right: "2%",
            },
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    };

    useEffect(() => {
        fetchData();

        if (usageData) {
            analyzeData();
        }

        const handleStorageChange = () => {
            fetchData();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [usageData]);

    return (
        <div className="relative">
            {/* Tooltip Button */}
            <div
                className="absolute top-[30px] left-3 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('spiderInfoTooltip'); // Updated id
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('spiderInfoTooltip'); // Updated id
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
            </div>
            {/* Tooltip Content */}
            <div
                id="spiderInfoTooltip" // Updated id
                className="absolute top-[70px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                style={{ display: 'none', width: '200px', pointerEvents: 'none' }}
            >
                This radar chart shows the distribution of water usage across different sectors for the selected state and year.
            </div>
            {/* Radar Chart */}
            <div
                id="spider-chart"
                className="w-full h-[454px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] rounded-lg ml-3 mt-8"
            ></div>
        </div>
    );
};

export default SpiderGraph;
