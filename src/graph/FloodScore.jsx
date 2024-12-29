import React, { useEffect } from "react";
import * as echarts from "echarts";
import {BASE_URL} from '../Config.js'

const FloodScore = ({ FloodScore }) => {
    useEffect(() => {
        // Initialize ECharts
        const chartDom = document.getElementById("FloodChart");
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: "Flood Score",
                left: "center",
                textStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                },
                padding: [0, 0, 90, 40],
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    const riskScore = params.value; // Use the value directly
                    let riskLevel = "";
                    if (riskScore <= 25) {
                        riskLevel = "Low Risk";
                    } else if (riskScore <= 50) {
                        riskLevel = "Medium Risk";
                    } else if (riskScore <= 75) {
                        riskLevel = "High Risk";
                    } else {
                        riskLevel = "Very High Risk";
                    }

                    return `
            <div>
              <strong>Risk Score:</strong> ${Math.round(riskScore)}<br/>
              <strong>Risk Level:</strong> ${riskLevel}
            </div>
          `;
                },
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderColor: "#fff",
                borderWidth: 1,
                textStyle: {
                    color: "#fff",
                    fontSize: 14,
                },
                showDelay: 0,
                hideDelay: 200,
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        backgroundColor: "transparent",
                    },
                },
                itemSize: 18,
                top: "1%",
                right: "5%",
            },
            series: [
                {
                    type: "gauge",
                    startAngle: 180,
                    endAngle: 0,
                    center: ["50%", "80%"],
                    radius: "110%",
                    min: 0,
                    max: 100, // The score range is 0-100
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [
                                [0.25, "#7CFFB2"], // 0-25 Low Risk
                                [0.5, "#58D9F9"], // 26-50 Medium Risk
                                [0.75, "#FDDD60"], // 51-75 High Risk
                                [1, "#FF6E76"], // 76-100 Very High Risk
                            ],
                        },
                    },
                    pointer: {
                        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
                        length: "12%",
                        width: 20,
                        offsetCenter: [0, "-60%"],
                        itemStyle: {
                            color: "auto",
                        },
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: "auto",
                            width: 2,
                        },
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: "auto",
                            width: 5,
                        },
                    },
                    axisLabel: {
                        color: "white",
                        fontSize: 15,
                        distance: -50,
                        rotate: "tangential",
                        formatter: function (value) {
                            if (value === 12.5) {
                                return "Low Risk";
                            } else if (value === 37.5) {
                                return "Medium Risk";
                            } else if (value === 62.5) {
                                return "High Risk";
                            } else if (value === 87.5) {
                                return "Very High Risk";
                            }
                            return "";
                        },
                    },
                    title: {
                        offsetCenter: [0, "-10%"],
                        fontSize: 20,
                        color: "white",
                    },
                    detail: {
                        fontSize: 30,
                        offsetCenter: [0, "-35%"],
                        valueAnimation: true,
                        formatter: function (value) {
                            return `${Math.round(value)}/100`; // Use the raw score directly
                        },
                        color: "white",
                    },
                    data: [
                        {
                            value: FloodScore, // Directly use FloodScore
                            name: "Score",
                        },
                    ],
                },
            ],
        };

        myChart.setOption(option);

        // Cleanup on unmount
        return () => {
            myChart.dispose();
        };
    }, [FloodScore]);

    return (
        <div className="relative">
            <div
                className="absolute left-7 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('InfoFloodScore');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('InfoFloodScore');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="InfoFloodScore"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    A flood score is a numerical metric that quantifies the likelihood of flooding in a specific area, considering factors like rainfall, terrain, water flow, and infrastructure. It helps in risk assessment and planning for flood prevention and response.
                </div>
            </div>
            <div
                id="FloodChart"
                className="w-[650px] ml-6 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg">
            </div>
        </div>
    );
};

export default FloodScore;
