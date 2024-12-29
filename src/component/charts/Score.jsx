import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const GaugeChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [value, setValue] = useState(0);
  const [stateName, setStateName] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false); // For showing a loading state

  // Function to fetch data from API and update the state
  const analyzeData = async () => {
    const selectedDistrict = localStorage.getItem("selectedDistrict");
    const selectedMonth = localStorage.getItem("selectedMonth");

    setStateName(selectedDistrict || "");
    setYear(selectedMonth || "");

    if (selectedDistrict && selectedMonth) {
      setLoading(true); // Start loading

      try {
        // Fetch data from the API
        const response = await fetch(
          `http://127.0.0.1:8000/api/risk/get-risk/${selectedDistrict}/2024/${selectedMonth}`
        );
        const data = await response.json();

        if (data && data.response && data.response.length > 0) {
          let riskScore = data.response[0].risk_score;
          if(riskScore == 100){
            riskScore = 92;
          }
          setValue(riskScore); // Set the value based on the risk score
        } else {
          setValue(0); // If no data, set default value to 0
        }
      } catch (error) {
        console.error("Error fetching risk data:", error);
        setValue(0); // Set default value in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  // Effect to listen for localStorage changes
  useEffect(() => {
    analyzeData(); // Initial load

    const handleStorageChange = () => {
      analyzeData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [stateName, year]);

  useEffect(() => {
    if (chartRef.current) {
      // Initialize the chart
      chartInstance.current = echarts.init(chartRef.current);

      const _panelImageURL =
        "https://echarts.apache.org/examples/data/asset/img/custom-gauge-panel.png";
      const _valOnRadianMax = 100;
      const _outerRadius = 140;
      const _innerRadius = 90;
      const _pointerInnerRadius = 25;
      const _insidePanelRadius = 130;

      function renderItem(params, api) {
        const valOnRadian = api.value(1);
        const coords = api.coord([api.value(0), valOnRadian]);
        const polarEndRadian = coords[3];
        const imageStyle = {
          image: _panelImageURL,
          x: params.coordSys.cx - _outerRadius,
          y: params.coordSys.cy - _outerRadius,
          width: _outerRadius * 2,
          height: _outerRadius * 2,
        };
        return {
          type: "group",
          children: [
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "sector",
                shape: {
                  cx: params.coordSys.cx,
                  cy: params.coordSys.cy,
                  r: _outerRadius,
                  r0: _innerRadius,
                  startAngle: 0,
                  endAngle: -polarEndRadian,
                  transition: "endAngle",
                  enterFrom: { endAngle: 0 },
                },
              },
            },
            {
              type: "image",
              style: imageStyle,
              clipPath: {
                type: "polygon",
                shape: {
                  points: makePointerPoints(params, polarEndRadian),
                },
                extra: {
                  polarEndRadian: polarEndRadian,
                  transition: "polarEndRadian",
                  enterFrom: { polarEndRadian: 0 },
                },
                during: function (apiDuring) {
                  apiDuring.setShape(
                    "points",
                    makePointerPoints(
                      params,
                      apiDuring.getExtra("polarEndRadian")
                    )
                  );
                },
              },
            },
            {
              type: "circle",
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _insidePanelRadius,
              },
              style: {
                fill: "#fff",
                shadowBlur: 25,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(76,107,167,0.4)",
              },
            },
            {
              type: "text",
              extra: {
                valOnRadian: valOnRadian,
                transition: "valOnRadian",
                enterFrom: { valOnRadian: 0 },
              },
              style: {
                text: makeText(valOnRadian),
                fontSize: 50,
                fontWeight: 700,
                x: params.coordSys.cx,
                y: params.coordSys.cy,
                fill: "rgb(0,50,190)",
                align: "center",
                verticalAlign: "middle",
                enterFrom: { opacity: 0 },
              },
              during: function (apiDuring) {
                apiDuring.setStyle(
                  "text",
                  makeText(apiDuring.getExtra("valOnRadian"))
                );
              },
            },
          ],
        };
      }

      function convertToPolarPoint(renderItemParams, radius, radian) {
        return [
          Math.cos(radian) * radius + renderItemParams.coordSys.cx,
          -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
        ];
      }

      function makePointerPoints(renderItemParams, polarEndRadian) {
        return [
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
          convertToPolarPoint(
            renderItemParams,
            _outerRadius,
            polarEndRadian + Math.PI * 0.03
          ),
          convertToPolarPoint(
            renderItemParams,
            _pointerInnerRadius,
            polarEndRadian
          ),
        ];
      }

      function makeText(valOnRadian) {
        return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + "%";
      }

      const option = {
        animationEasing: "quarticInOut",
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        animationEasingUpdate: "quarticInOut",
        dataset: {
          source: [[1, value]],
        },
        tooltip: {
          trigger: "item", // Show the tooltip when hovering over the item
          formatter: function (params) {
            // Customize the tooltip content
            const riskFactor = value.toFixed(2);
            return `
                  <div>
                      <strong>Risk Score</strong><br/>
                      <strong>Value:</strong> ${riskFactor}%<br/>
                      <strong>State:</strong> ${stateName}<br/>
                      <strong>Year:</strong> ${year}
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
        },
        angleAxis: {
          type: "value",
          startAngle: 0,
          show: false,
          min: 0,
          max: 100,
        },
        radiusAxis: {
          type: "value",
          show: false,
        },
        polar: {},
        title: {
          text: "Risk Score", // Set the title text
          left: "center", // Center the title
          top: "1px", // Adjust vertical position
          textStyle: {
            color: "white", // Set title color to white
            fontSize: 18, // Set title font size
            fontWeight: "bold", // Set title font weight to bold
          },
        },
        series: [
          {
            type: "custom",
            coordinateSystem: "polar",
            renderItem,
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
        className="absolute left-7 z-[100] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => {
          const tooltip = document.getElementById('RiskScore');
          if (tooltip) tooltip.style.display = 'block';
        }}
        onMouseLeave={() => {
          const tooltip = document.getElementById('RiskScore');
          if (tooltip) tooltip.style.display = 'none';
        }}
      >
        ℹ️
        <div
          id="RiskScore"
          className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
          style={{ display: 'none', width: '200px' }}
        >
          A flood score is a numerical metric that quantifies the likelihood of flooding in a specific area, considering factors like rainfall, terrain, water flow, and infrastructure. It helps in risk assessment and planning for flood prevention and response.
        </div>
      </div>
      <div ref={chartRef} className="w-[650px] ml-6 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg" />
    </div>
  );
};

export default GaugeChart;
