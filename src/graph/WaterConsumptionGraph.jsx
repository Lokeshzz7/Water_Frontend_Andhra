import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

const WaterConsumptionGraph = () => {
    const [chartData, setChartData] = useState({
        months: [],
        grossCapacity: [],
        floodCushion: [],
        currentStorage: [],
    });

    const [apiData, setApiData] = useState([]); // To store raw API data for display
    const [interpretation, setInterpretation] = useState("");
    const [insights, setInsights] = useState("");
    const [recommendations, setRecommendations] = useState("");

    const [selectedReservoir, setSelectedReservoir] = useState(
        parseInt(localStorage.getItem("selectedReservoir") || "6")
    );
    const [selectedYear, setSelectedYear] = useState(
        parseInt(localStorage.getItem("selectedYear") || "2023")
    );

    // Array for month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    // Fetch data for the selected reservoir and year (for 12 months)
    const fetchMonthlyData = async (year, reservoirId) => {
        try {
            const url = `http://localhost:8000/api/reservoir/get-reservoir-by-id/${reservoirId}/${year}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 12) {
                // Successfully received 12 months of data
                const months = [];
                const grossCapacity = [];
                const floodCushion = [];
                const currentStorage = [];

                data.forEach((monthData) => {
                    months.push(monthNames[monthData.month - 1]); // Use month name instead of number
                    grossCapacity.push(monthData.gross_capacity || 0);
                    floodCushion.push(monthData.flood_cushion || 0);
                    currentStorage.push(monthData.current_storage || 0);
                });

                setChartData({
                    months,
                    grossCapacity,
                    floodCushion,
                    currentStorage,
                });

                setApiData(data);

                // Interpret the data (calculating averages, max, min)
                const totalStorage = currentStorage.reduce((sum, value) => sum + value, 0);
                const avgStorage = (totalStorage / currentStorage.length).toFixed(2);

                const maxStorage = Math.max(...currentStorage);
                const minStorage = Math.min(...currentStorage);
                const maxMonth = months[currentStorage.indexOf(maxStorage)];
                const minMonth = months[currentStorage.indexOf(minStorage)];

                setInterpretation(
                    `This line chart represents water reservoir data for the selected reservoir for each month of the selected year. The data includes Gross Capacity, Flood Cushion, Current Storage, and Current Level.`
                );
                setInsights(
                    `The month with the highest storage was ${maxMonth} (${maxStorage} units), and the month with the lowest storage was ${minMonth} (${minStorage} units). The average storage across the 12 months is ${avgStorage} units.`
                );
                setRecommendations(
                    `Consider strategies to improve storage during months with low storage (${minMonth}) and enhance flood cushion mechanisms during months with high storage (${maxMonth}).`
                );
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setChartData({
                months: [],
                grossCapacity: [],
                floodCushion: [],
                currentStorage: [],
            });
        }
    };

    useEffect(() => {
        fetchMonthlyData(selectedYear, selectedReservoir);
    }, [selectedReservoir, selectedYear]);

    // Initialize chart with the fetched data
    useEffect(() => {
        if (chartData.months.length > 0) {
            const chartDom = document.getElementById("water-consumption-chart");
            const myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: "Reservoir Data for Selected Month",
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
                    data: ["Gross Capacity", "Flood Cushion", "Current Storage"],
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
                    data: chartData.months, // Use month names here
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
                This line chart shows the water storage, water capacity, water level, and consumption for each month.
            </div>
            <div
                id="water-consumption-chart"
                className="w-full h-[330px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] rounded-lg ml-3 pt-4"
            ></div>

            {/* Graph Insights Section */}
            <div className="mt-4 text-white">
                <h3 className="font-bold text-xl mb-2">Interpretation</h3>
                <p>{interpretation}</p>

                <h3 className="font-bold text-xl mt-4 mb-2">Insights</h3>
                <p>{insights}</p>

                <h3 className="font-bold text-xl mt-4 mb-2">Recommendations</h3>
                <p>{recommendations}</p>
            </div>
        </div>
    );
};

export default WaterConsumptionGraph;
