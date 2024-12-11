import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

const MonthConsumptionGraph = () => {
    const [chartData, setChartData] = useState({});
    const [districtId, setDistrictId] = useState(localStorage.getItem("selectedDistrict"));
    const [selectedYear, setSelectedYear] = useState(localStorage.getItem("selectedYear"));
    const [noData, setNoData] = useState(false);

    const fetchMonthData = async (districtId, selectedYear) => {
        console.log("Starting to fetch data...");
        
        
    
        const apiEndpoint = `http://127.0.0.1:8000/api/forecast/get-usage/${districtId}/${selectedYear}/`;
        console.log(`Fetching data from API: ${apiEndpoint}`);
        
        try {
            const response = await fetch(apiEndpoint); // Using await here
            console.log("API response received.");
    
            const data = await response.json();
            console.log("API data parsed:", data);
    
            if (!data || data.length === 0) {
                console.log("No data found in response.");
                setNoData(true);
                setChartData({});
                return;
            }
    
            // Defining months and empty data arrays
            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            const consumptionData = new Array(12).fill(0);
            const inflowData = new Array(12).fill(0);
            const irrigationData = new Array(12).fill(0);
            const industryData = new Array(12).fill(0);
            const domesticData = new Array(12).fill(0);
    
            // Populating the data arrays
            data.forEach((entry) => {
                const monthIndex = entry.month - 1;  // Adjust for 0-indexed array
                if (monthIndex >= 0 && monthIndex < 12) {
                    console.log(`Processing month: ${entry.month}`);
                    console.log(`Consumption: ${entry.consumption}, Inflow: ${entry.rainfall}, Irrigation: ${entry.irrigation}, Industry: ${entry.industry}, Domestic: ${entry.domestic}`);
                    
                    consumptionData[monthIndex] = entry.consumption || 0;
                    inflowData[monthIndex] = entry.rainfall || 0;
                    irrigationData[monthIndex] = entry.irrigation || 0;
                    industryData[monthIndex] = entry.industry || 0;
                    domesticData[monthIndex] = entry.domestic || 0;
                }
            });
    
            // Update chartData state
            setChartData({
                months,
                consumptionData,
                inflowData,
                irrigationData,
                industryData,
                domesticData,
            });
    
            setNoData(false); // Data is available
            console.log("Data has been successfully processed and set in state.");
    
        } catch (error) {
            console.error("Error fetching month data:", error);
            setNoData(true); // Set no data on error
        }
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
        if (Object.keys(chartData).length === 0 || noData) return;

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
    }, [chartData, noData]);

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
            {noData ? (
                <div
                    className="w-[655px] ml-2 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
                >
                    No data available for the year {selectedYear}.
                </div>
            ) : (
                <div
                    id="monthmain"
                    className="w-[655px] ml-2 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
                ></div>
            )}
        </div>
    );
};

export default MonthConsumptionGraph;
