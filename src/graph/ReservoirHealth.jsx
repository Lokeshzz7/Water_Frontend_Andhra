import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

const ReservoirHealth = ({ current_storage  , flood_cushion  , gross_capacity  }) => {
  const [CurrentYearData, SetCurrentYearData] = useState([]); // Initially empty array
  const [riskScore, setRiskScore] = useState(0);
  const [insights, setInsights] = useState({
    interpretation: '',
    insights: '',
    recommendations: '',
  });

  console.log("current_storage : " , current_storage);
  // Function to fetch data from API
  const fetchData = async () => {
    const selectedDistrict = JSON.parse(localStorage.getItem("selectedDistrict"));
    const selectedReservoir = JSON.parse(localStorage.getItem("selectedReservoir"));
    const selectedYear = parseInt(localStorage.getItem("selectedYear") || 2000, 10);
    const selectedMonth = parseInt(localStorage.getItem("selectedMonth") || 2000, 10);

    if (!selectedReservoir) {
      console.log("No selected reservoir found in localStorage.");
      return; // If no selected reservoir, exit
    }

    // Log the API URL that is being called
    const CurrentapiUrl = `http://127.0.0.1:8000/api/reservoir/get-score-data?year=${selectedYear}&reservoir_id=${selectedReservoir}&district_id=${selectedDistrict}&month=${selectedMonth}`;
    console.log(`Calling API with URL: ${CurrentapiUrl}`);
    const Currentresponse = await fetch(CurrentapiUrl);
    const CurrentData = await Currentresponse.json();
    console.log("Current Data: ", CurrentData);
    SetCurrentYearData(CurrentData); // Set the data in the state

    const { age, evaporation, rainfall, silt } = CurrentData;
    console.log("Fetched data: ", age);

    let age_final = age;  // Initialize age_final

    if (selectedYear < 2024) {
      age_final = age - (2024 - selectedYear);  // Correctly calculate age_final
    }

    // Construct the API URL based on the year selected
    const apiUrl = `http://127.0.0.1:8000/api/reservoir/get-score?current_storage=${current_storage}&gross_capacity=${gross_capacity}&siltation=${silt}&flood_cushion=${flood_cushion}&evaporation=${evaporation}&rainfall=${rainfall}&age=${age_final}&design_life=100`;

    console.log("apiUrl to get score: ", apiUrl);

    try {
      // Fetch data from the API
      const response = await fetch(apiUrl);

      if (!response.ok) {
        // If the response is not ok, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      console.log("API Response:", data); // Log the API response
      console.log("Score: " + data.predicted_score);

      // If the response contains the predicted_score, update the state
      if (selectedYear > 2024) {
        setRiskScore(data.score / 100); // Normalize to a 0-1 scale
      } else {
        setRiskScore(data.score / 100); // Default to 0 if no score is found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRiskScore(0.09); // Default to 0 in case of an error
    }
  };

  // Function to generate description based on risk score
  const getRiskScoreDescription = (riskScore) => {
    let riskLevel = '';
    if (riskScore >= 0.75) {
      riskLevel = 'No Risk';
    } else if (riskScore >= 0.5) {
      riskLevel = 'Medium Risk';
    } else if (riskScore >= 0.25) {
      riskLevel = 'High Risk';
    } else {
      riskLevel = 'Very High Risk';
    }

    return {
      interpretation: `The reservoir's health is measured with a risk score. The current score of ${Math.round(riskScore * 100)}% corresponds to a risk level of **${riskLevel}**, which reflects the overall state of the reservoir. This value is based on various factors such as water levels, environmental conditions, and infrastructure status.`,
      insights: `A **${riskLevel}** score indicates that there are significant concerns regarding the reservoir's ability to provide water reliably. Immediate action is needed to address factors that contribute to the low score. Monitoring and improving these factors can prevent severe shortages in the future.`,
      recommendations: 'To improve the risk score, focus on improving water conservation measures, upgrading infrastructure, and addressing environmental challenges that impact reservoir health. Additionally, monitoring the water levels regularly and adjusting management practices accordingly will help to reduce the risk further.',
    };
  };

  // Effect to fetch data on mount and update insights
  useEffect(() => {
    fetchData(); // Fetch data when component mounts  

    // Re-fetch data if localStorage changes
    const handleStorageChange = () => {
      fetchData(); // Re-fetch data when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array, this effect runs once after the first render

  // Effect to log the updated CurrentYearData after it's set
  useEffect(() => {
    if (CurrentYearData.length > 0) {
      console.log("Updated Current Data:", CurrentYearData);
    }
  }, [CurrentYearData]); // This effect will run when CurrentYearData changes

  // Effect to update insights based on risk score
  useEffect(() => {
    const generatedDescription = getRiskScoreDescription(riskScore);
    setInsights(generatedDescription);

    // Initialize ECharts
    const chartDom = document.getElementById("reservoir-health-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: "Reservoir Score",
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
            const riskScore = params.value * 100;
            let riskLevel = "";
            if (params.value >= 0.75) {
              riskLevel = "Very Good";
            } else if (params.value >= 0.5) {
              riskLevel = "Good";
            } else if (params.value >= 0.25) {
              riskLevel = "Medium";
            } else {
              riskLevel = "Low";
            }

            return `
              <div>
                <strong>Risk Score:</strong> ${Math.round(riskScore)}%<br/>
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
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              backgroundColor: "transparent"
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
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, "#FF6E76"],
                  [0.5, "#FDDD60"],
                  [0.75, "#58D9F9"],
                  [1, "#7CFFB2"],
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
                if (value === 0.875) {
                  return "Very Good";
                } else if (value === 0.625) {
                  return "Good";
                } else if (value === 0.375) {
                  return "Medium";
                } else if (value === 0.125) {
                  return "Low";
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
                return `${Math.round(value * 100)}/100`;
              },
              color: "white",
            },
            data: [
              {
                value: riskScore,
                name: "Reservoir Score",
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
    }
  }, [riskScore]);

  return (
    <div className="relative">
       <div
                className="absolute left-7 z-[100] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => {
                    const tooltip = document.getElementById('symbol');
                    if (tooltip) tooltip.style.display = 'block';
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById('symbol');
                    if (tooltip) tooltip.style.display = 'none';
                }}
            >
                ℹ️
                <div
                    id="symbol"
                    className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
                    style={{ display: 'none', width: '200px' }}
                >
                    This graph shows the distribution of factors affecting risk for the selected district and year.
                </div>
            </div>

      <div
        id="reservoir-health-chart"
        className="w-[650px] ml-3 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg mb-8"
      ></div>
    </div>
  );
};

export default ReservoirHealth;
