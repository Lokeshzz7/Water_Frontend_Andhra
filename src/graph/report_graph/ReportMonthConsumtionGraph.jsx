import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

const ReportMonthConsumptionGraph = () => {
    const [chartData, setChartData] = useState({});
    const [districtId, setDistrictId] = useState(localStorage.getItem("selectedDistrict"));
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem("selectedYear"));
    const [interpretation, setInterpretation] = useState("");
    const [insights, setInsights] = useState("");
    const [recommendations, setRecommendations] = useState("");

    // Function to fetch and transform the data from the API
    const fetchMonthData = (districtId, selectedYear) => {
        const apiEndpoint =
            parseInt(selectedYear, 10) > 2024
                ? `http://127.0.0.1:8000/api/forecast/predict-usage/${districtId}/${selectedYear}`
                : `http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${selectedYear}/`;

        fetch(apiEndpoint)
            .then((response) => response.json())
            .then((data) => {
                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];

                const consumptionData = new Array(12).fill(0);
                const inflowData = new Array(12).fill(0);
                const irrigationData = new Array(12).fill(0);
                const industryData = new Array(12).fill(0);
                const domesticData = new Array(12).fill(0);

                data.forEach((entry) => {
                    const monthIndex = entry.month - 1;
                    if (monthIndex >= 0 && monthIndex < 12) {
                        consumptionData[monthIndex] = entry.consumption || 0;
                        inflowData[monthIndex] = (entry.rainfall + entry.inflow_states) || 0;
                        irrigationData[monthIndex] = entry.irrigation || 0;
                        industryData[monthIndex] = entry.industry || 0;
                        domesticData[monthIndex] = entry.domestic || 0;
                    }
                });

                setChartData({
                    months,
                    consumptionData,
                    inflowData,
                    irrigationData,
                    industryData,
                    domesticData,
                });

                // Generate insights dynamically
                const totalConsumption = consumptionData.reduce((sum, value) => sum + value, 0);
                const totalInflow = inflowData.reduce((sum, value) => sum + value, 0);
                const avgConsumption = (totalConsumption / 12).toFixed(2);
                const avgInflow = (totalInflow / 12).toFixed(2);

                const maxConsumption = Math.max(...consumptionData);
                const maxInflow = Math.max(...inflowData);
                const peakMonth = months[consumptionData.indexOf(maxConsumption)];
                const inflowPeakMonth = months[inflowData.indexOf(maxInflow)];

                setInterpretation(
                    `This line chart represents the monthly water usage and inflow data for ${selectedYear}. It highlights key usage categories such as Irrigation, Industry, and Domestic consumption.`
                );
                setInsights(
                    `The highest consumption was observed in ${peakMonth} (${maxConsumption} units), and the highest inflow occurred in ${inflowPeakMonth} (${maxInflow} units). The average monthly consumption is ${avgConsumption} units, while the average inflow is ${avgInflow} units.`
                );
                setRecommendations(
                    `Focus on improving water conservation strategies during high-consumption months like ${peakMonth}. Additionally, optimize storage mechanisms during peak inflow months like ${inflowPeakMonth} to reduce wastage.`
                );
            })
            .catch((error) => console.error("Error fetching month data:", error));
    };

    useEffect(() => {
        fetchMonthData(districtId, selectedYear);
    }, [districtId, selectedYear]);

    useEffect(() => {
        const handleStorageChange = () => {
            setDistrictId(localStorage.getItem("selectedDistrict"));
            setSelectedYear(localStorage.getItem("selectedYear"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (Object.keys(chartData).length === 0) return;

        const chartDom = document.getElementById("monthmain");
        const myChart = echarts.init(chartDom);

        const isFutureYear = parseInt(selectedYear, 10) > 2024;
        const titleText = isFutureYear
            ? `Predicted Consumption Data for ${selectedYear}`
            : `Consumption Data for ${selectedYear}`;

        const option = {
            backgroundColor: "transparent",
            textStyle: {
                color: "#ffffff",
            },
            legend: {
                data: ["Consumption", "Inflow", "Irrigation", "Industry", "Domestic"],
                textStyle: {
                    color: "#ffffff",
                },
                top: "30px",
            },
            title: {
                text: titleText,
                textStyle: {
                    color: "#ffffff",
                },
                top: "5px",
                left: "center",
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                type: "category",
                data: chartData.months,
                axisLabel: {
                    color: "#ffffff",
                },
            },
            yAxis: {
                name: "Consumption / Inflow",
                nameLocation: "middle",
                nameRotate: 90,
                nameTextStyle: {
                    color: "#ffffff",
                },
                nameGap: 45,
                axisLabel: {
                    color: "#ffffff",
                },
            },
            series: [
                { name: "Consumption", type: "line", data: chartData.consumptionData },
                { name: "Inflow", type: "line", data: chartData.inflowData },
                { name: "Irrigation", type: "line", data: chartData.irrigationData },
                { name: "Industry", type: "line", data: chartData.industryData },
                { name: "Domestic", type: "line", data: chartData.domesticData },
            ],
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true,
                        backgroundColor: "transparent",
                        iconStyle: {
                            borderColor: "#ffffff",
                        },
                    },
                },
            },
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [chartData]);

    return (
        <div className="relative">
            <div
                className="absolute left-7 z-[100] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById("monthTooltip");
                    if (tooltip) tooltip.style.display = "block";
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById("monthTooltip");
                    if (tooltip) tooltip.style.display = "none";
                }}
            >
                ℹ️
                <div
                    id="monthTooltip"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: "none", width: "200px" }}
                >
                    This graph shows the distribution of consumption, inflow, and usage categories for the selected district and year.
                </div>
            </div>
            <div
                id="monthmain"
                className="w-[655px] ml-2  pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
            ></div>
            <div className="mt-4 text-white p-4 bg-[#1a2238] rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Graph Insights</h3>
                <p><b>Interpretation:</b> {interpretation}</p>
                <p><b>Insights:</b> {insights}</p>
                <p><b>Recommendations:</b> {recommendations}</p>
            </div>
        </div>
    );
};

export default ReportMonthConsumptionGraph;
