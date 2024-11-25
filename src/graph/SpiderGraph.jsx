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
            },
            tooltip: {},
            legend: {
                data: ["Water Usage"],
            },
            radar: {
                indicator: indicators,
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
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    };

    useEffect(() => {
        fetchData(); // Fetch data initially when the component mounts

        if (usageData) {
            analyzeData(); // Update the chart whenever `usageData` changes
        }

        const handleStorageChange = () => {
            fetchData(); // Re-fetch data when localStorage changes
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [usageData]);

    return (
        <div
            id="spider-chart"
            className="w-[800px] bg-white h-[454px] rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)]"
        ></div>
    );
};

export default SpiderGraph;
