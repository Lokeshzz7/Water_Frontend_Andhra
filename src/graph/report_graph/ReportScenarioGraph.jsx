import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

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
    const selectedState = localStorage.getItem("selectedState");
    const selectedYear = localStorage.getItem("selectedYear");

    setStateName(selectedState || "");
    setYear(selectedYear || "");

    if (selectedState && selectedYear) {
      // Mock fetch function to simulate API call
      const mockFetchRiskData = () => ({
        risk_factor: 65,
        rainfall: 110,
        evaporation: 70,
        population: 4,
      });

      const data = mockFetchRiskData(); // Replace this with an actual API fetch
      setValue(data.risk_factor);

      const description = generateDescription(
        data.risk_factor,
        data.rainfall,
        data.evaporation,
        data.population
      );

      setInsights({
        interpretation: description.interpretation,
        insights: description.insights,
        recommendations: description.recommendations,
      });
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
              color: "auto",
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
          <b>Interpretation:</b> {insights.interpretation}
        </p>
        <p>
          <b>Insights:</b> {insights.insights}
        </p>
        <p>
          <b>Recommendations:</b> {insights.recommendations}
        </p>
      </div>
    </div>
  );
};

export default ReportScenarioGraph;
