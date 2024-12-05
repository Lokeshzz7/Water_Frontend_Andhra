import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

// Mock function to generate risk data for districts
const mockFetchDistrictRiskData = () => {
    const districts = [
        { name: "Anantapur" },
        { name: "Chittoor" },
        { name: "East Godavari" },
        { name: "Guntur" },
        { name: "Y.S.R Kadapa" },
        { name: "Krishna" },
        { name: "Kurnool" },
        { name: "Sri Potti Sriramulu Nellore" },
        { name: "Prakasam" },
        { name: "Srikakulam" },
        { name: "Visakhapatnam" },
        { name: "Vizianagaram" },
        { name: "West Godavari" }
    ];

    const generateRiskData = () => {
        const riskFactor = Math.floor(Math.random() * 21) + 80; // Random number between 80 and 100
        const rainfall = Math.floor(Math.random() * (200 - 50 + 1)) + 50; // Random rainfall between 50 and 200 mm
        const evaporation = Math.floor(Math.random() * (150 - 30 + 1)) + 30; // Random evaporation between 30 and 150 mm
        const population = Math.floor(Math.random() * (10 - 1 + 1)) + 1; // Random population factor between 1 and 10 (could represent millions)

        return {
            risk_factor: riskFactor,
            rainfall: rainfall,
            evaporation: evaporation,
            population: population,
        };
    };

    return districts.map(district => ({
        name: district.name,
        data: generateRiskData(),
    }));
};

// Mapping of district IDs to names
const districtIdToName = {
    3: "Anantapur",
    6: "Chittoor",
    7: "East Godavari",
    9: "Guntur",
    26: "Y.S.R Kadapa",
    13: "Krishna",
    10: "Kurnool",
    20: "Sri Potti Sriramulu Nellore",
    18: "Prakasam",
    21: "Srikakulam",
    23: "Visakhapatnam",
    24: "Vizianagaram",
    25: "West Godavari"
};

const ReportScenarioGraph = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [value, setValue] = useState(0);
    const [stateName, setStateName] = useState("");
    const [year, setYear] = useState("");
    const [insights, setInsights] = useState({
        interpretation: "",
        insights: "",
        recommendations: "",
    });

    const fetchDataAndAnalyze = () => {
        const selectedStateId = localStorage.getItem("selectedDistrict");
        const selectedState = districtIdToName[selectedStateId]; // Get the name from the ID

        if (!selectedState) {
            console.log("Invalid or missing district ID in local storage.");
            return;
        }

        setStateName(selectedState);
        console.log("Selected State from Local Storage:", selectedState);

        const districtData = mockFetchDistrictRiskData();
        console.log("Generated District Data:", districtData);

        const selectedDistrict = districtData.find(district => district.name === selectedState);
        console.log("Selected District:", selectedDistrict);

        if (selectedDistrict) {
            const data = selectedDistrict.data;
            console.log("Data for Selected District:", data);

            setValue(data.risk_factor);

            const description = generateDescription(
                data.risk_factor,
                data.rainfall,
                data.evaporation,
                data.population
            );

            console.log("Generated Description:", description);

            setInsights({
                interpretation: description.interpretation,
                insights: description.insights,
                recommendations: description.recommendations,
            });
        } else {
            console.log("No matching district found for:", selectedState);
        }
    };

    const generateDescription = (score, rainfall, evaporation, population) => {
        let interpretation, insights, recommendations;

        if (score < 50) {
            interpretation =
                "This gauge chart indicates a significant risk in water management for the selected state and year.";
            insights = `The low score (${score}%) reflects insufficient rainfall (${rainfall} mm), high evaporation (${evaporation} mm), and increasing population (${population}% growth).`;
            recommendations =
                "Prioritize water conservation efforts and implement strategies to reduce evaporation and manage demand.";
        } else if (score >= 50 && score <= 75) {
            interpretation =
                "This gauge chart represents moderate water management conditions for the selected state and year.";
            insights = `The moderate score (${score}%) suggests average rainfall (${rainfall} mm), with high evaporation (${evaporation} mm) and growing population (${population}% growth) contributing to challenges.`;
            recommendations =
                "Focus on improving water usage efficiency and addressing evaporation rates.";
        } else {
            interpretation =
                "This gauge chart highlights optimal water management conditions for the selected state and year.";
            insights = `The high score (${score}%) is supported by adequate rainfall (${rainfall} mm), sustainable evaporation levels (${evaporation} mm), and manageable population growth (${population}%).`;
            recommendations =
                "Continue monitoring water resource conditions to sustain the favorable balance.";
        }

        return { interpretation, insights, recommendations };
    };

    useEffect(() => {
        fetchDataAndAnalyze(); // Initial data fetch

        const handleStorageChange = () => {
            fetchDataAndAnalyze();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);

            const option = {
                series: [
                    {
                        type: "gauge",
                        startAngle: 225,
                        endAngle: -45,
                        min: 0,
                        max: 100,
                        pointer: { show: true },
                        detail: {
                            formatter: "{value} %",
                            fontSize: 20,
                            color: "white",
                        },
                        data: [{ value, name: "Risk Score" }],
                    },
                ],
            };

            chartInstance.current.setOption(option);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, [value]);

    return (
        <div className="relative">
            <div
                className="absolute top-[10px] left-6 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById("ScenarioInfoTooltip");
                    if (tooltip) tooltip.style.display = "block";
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById("ScenarioInfoTooltip");
                    if (tooltip) tooltip.style.display = "none";
                }}
            >
                ℹ️
            </div>
            <div
                id="ScenarioInfoTooltip"
                className="absolute top-[70px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                style={{ display: "none", width: "200px", pointerEvents: "none" }}
            >
                This gauge chart shows the risk assessment score for the selected state and year.
            </div>

            <div
                ref={chartRef}
                className="w-[600px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component h-[330px] rounded-lg ml-6 pt-4 mr-5"
            />
            <div className="mt-4 text-white p-4 bg-[#1a2238] rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">Analysis Summary</h3>
                <p>
                    <b>Interpretation:</b> {insights.interpretation || "No data available"}
                </p>
                <p>
                    <b>Insights:</b> {insights.insights || "No data available"}
                </p>
                <p>
                    <b>Recommendations:</b> {insights.recommendations || "No data available"}
                </p>
            </div>
        </div>
    );
};

export default ReportScenarioGraph;
