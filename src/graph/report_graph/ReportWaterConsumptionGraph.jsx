import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

// Helper function to normalize data
const normalizeValue = (value) => {
    if (value === -999 || value === "NA") {
        return 0;
    }
    return value;
};

const ReportWaterConsumptionGraph = () => {
    const [chartData, setChartData] = useState({
        years: [],
        grossCapacity: [],
        floodCushion: [],
        currentStorage: [],
        currentLevel: [],
    });

    const [apiData, setApiData] = useState([]); // To store raw API data for display
    const [interpretation, setInterpretation] = useState("");
    const [insights, setInsights] = useState("");
    const [recommendations, setRecommendations] = useState("");

    const [selectedReservoir, setSelectedReservoir] = useState(
        parseInt(localStorage.getItem(`selectedReservoir`) || "6")
    );
    const [selectedYear, setSelectedYear] = useState(
        parseInt(localStorage.getItem(`selectedYear`) || "2023")
    );

    const fetchYearData = async (year, reservoirId) => {
        try {
            let response, data;
            let url = "";
            if (year < 2025) {
                url = `http://localhost:8000/api/reservoir/get-reservoir-by-id/${reservoirId}/${year}`;
                response = await fetch(url);
                data = await response.json();

                const monthOneData = data.find((reservoir) => reservoir.month === 1);
                return {
                    year,
                    grossCapacity: normalizeValue(monthOneData?.gross_capacity),
                    floodCushion: normalizeValue(monthOneData?.flood_cushion),
                    currentStorage: normalizeValue(monthOneData?.current_storage),
                    currentLevel: normalizeValue(monthOneData?.current_level),
                };
            } else {
                url = `http://127.0.0.1:8000/api/reservoir/get-reservoir-prediction/${reservoirId}/${year}`;
                response = await fetch(url);
                data = await response.json();

                const predictionData = data[0];
                return {
                    year,
                    grossCapacity: normalizeValue(predictionData?.gross_capacity),
                    floodCushion: normalizeValue(predictionData?.flood_cushion),
                    currentStorage: normalizeValue(predictionData?.current_storage),
                    currentLevel: 0, // Predictions may not include water levels
                };
            }
        } catch (error) {
            return {
                year,
                grossCapacity: 0,
                floodCushion: 0,
                currentStorage: 0,
                currentLevel: 0,
            };
        }
    };

    const fetchData = async () => {
        const years = [
            selectedYear - 2,
            selectedYear - 1,
            selectedYear,
            selectedYear + 1,
            selectedYear + 2,
        ];

        const fetchPromises = years.map((year) => fetchYearData(year, selectedReservoir));
        const results = await Promise.all(fetchPromises);

        const grossCapacity = results.map((item) => item.grossCapacity);
        const floodCushion = results.map((item) => item.floodCushion);
        const currentStorage = results.map((item) => item.currentStorage);
        const currentLevel = results.map((item) => item.currentLevel);

        setChartData({ years, grossCapacity, floodCushion, currentStorage, currentLevel });
        setApiData(results);

        // Generate insights dynamically
        const totalStorage = currentStorage.reduce((sum, value) => sum + value, 0);
        const avgStorage = (totalStorage / currentStorage.length).toFixed(2);

        const maxStorage = Math.max(...currentStorage);
        const minStorage = Math.min(...currentStorage);
        const maxYear = years[currentStorage.indexOf(maxStorage)];
        const minYear = years[currentStorage.indexOf(minStorage)];

        setInterpretation(
            `This line chart represents water reservoir data for the selected reservoir over a 5-year period. The data includes Gross Capacity, Flood Cushion, Current Storage, and Current Level.`
        );
        setInsights(
            `The year with the highest storage was ${maxYear} (${maxStorage} units), and the year with the lowest storage was ${minYear} (${minStorage} units). The average storage across the 5 years is ${avgStorage} units.`
        );
        setRecommendations(
            `Consider strategies to improve storage during years with low storage (${minYear}) and enhance flood cushion mechanisms in years with high storage (${maxYear}).`
        );
    };

    useEffect(() => {
        fetchData();
    }, [selectedReservoir, selectedYear]);

    useEffect(() => {
        const handleStorageChange = () => {
            const newSelectedReservoir = parseInt(localStorage.getItem(`selectedReservoir`) || "6");
            const newSelectedYear = parseInt(localStorage.getItem(`selectedYear`) || "2023");

            if (newSelectedReservoir !== selectedReservoir) {
                setSelectedReservoir(newSelectedReservoir);
            }
            if (newSelectedYear !== selectedYear) {
                setSelectedYear(newSelectedYear);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [selectedReservoir, selectedYear]);

    useEffect(() => {
        if (chartData.years.length > 0) {
            const chartDom = document.getElementById("water-consumption-chart");
            const myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: "Reservoir Data Over Time",
                    left: "center",
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
                    data: ["Gross Capacity", "Flood Cushion", "Current Storage", "Current Level"],
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
                            backgroundColor: "transparent",
                        },
                    },
                    itemSize: 18,
                    top: "1%",
                    right: "2%",
                },
                xAxis: {
                    type: "category",
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
                        name: "Gross Capacity",
                        type: "line",
                        data: chartData.grossCapacity,
                    },
                    {
                        name: "Flood Cushion",
                        type: "line",
                        data: chartData.floodCushion,
                    },
                    {
                        name: "Current Storage",
                        type: "line",
                        data: chartData.currentStorage,
                    },
                    {
                        name: "Current Level",
                        type: "line",
                        data: chartData.currentLevel,
                    },
                ],
            };

            myChart.setOption(option);

            return () => {
                myChart.dispose();
            };
        }
    }, [chartData]);

    return (
        <div className="relative">
            <div
                className="absolute top-[10px] left-3 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById("waterInfoTooltip");
                    if (tooltip) tooltip.style.display = "block";
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById("waterInfoTooltip");
                    if (tooltip) tooltip.style.display = "none";
                }}
            >
                ℹ️
            </div>
            <div
                id="waterInfoTooltip"
                className="absolute top-[70px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                style={{ display: "none", width: "200px", pointerEvents: "none" }}
            >
                This line chart shows the water storage, water capacity, water level, and consumption over the past years.
            </div>
            <div
                id="water-consumption-chart"
                className="w-full h-[330px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] rounded-lg ml-3 pt-4"
            ></div>

            {/* Graph Insights Section */}
            <div className="mt-4 text-white p-4 bg-[#1a2238] rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Graph Insights</h3>
                <p><b>Interpretation:</b> {interpretation}</p>
                <p><b>Insights:</b> {insights}</p>
                <p><b>Recommendations:</b> {recommendations}</p>
            </div>
        </div>
    );
};

export default ReportWaterConsumptionGraph;
