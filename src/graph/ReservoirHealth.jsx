import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import data from "../data/reservoir_fake_data.json"; // Replace with your JSON file path

const ReservoirHealth = () => {
  const [riskScore, setRiskScore] = useState(0);

  const fetchData = () => {
    const selectedYear = parseInt(localStorage.getItem("selectedYear") || 2000, 10);
    const selectedIndex = parseInt(localStorage.getItem("selectedState") || 0, 10);

    // Find the data matching the selected year and index
    const filteredData = data.find((item) => item.year === selectedYear && item.index === selectedIndex);

    if (filteredData && filteredData.riskScore) {
      setRiskScore(filteredData.riskScore / 10); // Normalize riskScore to fit the 0-1 scale
    } else {
      setRiskScore(0); // Default to 0 if no matching data is found
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts

    const handleStorageChange = () => {
      fetchData(); // Re-fetch data if localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Initialize ECharts
    const chartDom = document.getElementById("reservoir-health-chart");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "Risk Score",
        textStyle: {
          color: "white", // Set title color to white
          fontWeight: "bold", // Set title font weight to bold
          fontSize: 25, // Optional: Set title font size
        },
        padding: [20, 0, 20, 40], // Add padding below the title (top, right, bottom, left)
      },
      tooltip: {
        trigger: "item", // Trigger tooltip on item hover
        formatter: function (params) {
          const riskScore = params.value * 100; // Convert to percentage
          let riskLevel = "";
          if (params.value >= 0.75) {
            riskLevel = "No Risk";
          } else if (params.value >= 0.5) {
            riskLevel = "Medium Risk";
          } else if (params.value >= 0.25) {
            riskLevel = "High Risk";
          } else {
            riskLevel = "Very High Risk";
          }

          return `
            <div>
              <strong>Risk Score:</strong> ${Math.round(riskScore)}%<br/>
              <strong>Risk Level:</strong> ${riskLevel}
            </div>
          `;
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for the tooltip
        borderColor: "#fff", // White border color
        borderWidth: 1, // Border width
        textStyle: {
          color: "#fff", // Set tooltip text color to white
          fontSize: 14, // Font size for the tooltip
        },
        showDelay: 0,  // Delay before tooltip appears
        hideDelay: 200, // Delay before tooltip disappears
      },
      toolbox: {
        show: true, // Show the toolbox
        feature: {
          saveAsImage: {
            backgroundColor: "transparent"
          },
        },
        
        itemSize: 18, // Optional: Adjust the size of toolbox icons
        top: "4%", // Position the toolbox from the top (you can adjust this)
        right: "5%", // Position the toolbox from the right (you can adjust this)
      },
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          center: ["50%", "75%"],
          radius: "80%",
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
            color: "white", // Set axis labels color to white
            fontSize: 15,
            distance: -50,
            rotate: "tangential",
            formatter: function (value) {
              if (value === 0.875) {
                return "No Risk";
              } else if (value === 0.625) {
                return "Medium Risk";
              } else if (value === 0.375) {
                return "High Risk";
              } else if (value === 0.125) {
                return "Very High Risk";
              }
              return "";
            },
          },
          title: {
            offsetCenter: [0, "-10%"],
            fontSize: 20,
            color: "white", // Set title color to white
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, "-35%"],
            valueAnimation: true,
            formatter: function (value) {
              return `${Math.round(value * 100)}/100`;
            },
            color: "white", // Set the value color to white
          },
          data: [
            {
              value: riskScore, // Make sure this is a valid number
              name: "Reservoir Health Score",
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
  }, [riskScore]);

  return <div id="reservoir-health-chart" className="w-[400px] h-[454px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)] "></div>;
};

export default ReservoirHealth;
