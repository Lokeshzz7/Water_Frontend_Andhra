import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import data from "../../data/risk_assessment_fake_data.json";

const GaugeChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [value, setValue] = useState(0);
  const [stateName, setStateName] = useState("");
  const [year, setYear] = useState("");

  // Function to analyze data based on local storage values
  const analyzeData = () => {
    const selectedState = localStorage.getItem("selectedState");
    const selectedYear = localStorage.getItem("selectedYear");

    setStateName(selectedState || "");
    setYear(selectedYear || "");

    if (selectedState && selectedYear) {
      const matchingData = data.find(
        (item) =>
          item.index === parseInt(selectedState) && item.year === parseInt(selectedYear)
      );
      setValue(matchingData ? matchingData.risk_factor : 0);
    }
  };
  console.log("macthiing data ; " + value);

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
      const _outerRadius = 180;
      const _innerRadius = 150;
      const _pointerInnerRadius = 40;
      const _insidePanelRadius = 140;

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
        tooltip: {},
        angleAxis: {
          type: "value",
          startAngle: 0,
          show: false,
          min: 0,
          max: _valOnRadianMax,
        },
        radiusAxis: {
          type: "value",
          show: false,
        },
        polar: {},
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

  return <div ref={chartRef} className="w-[450px] bg-white h-[454px] rounded-lg ml-6 mt-8 mr-5 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)]" />;
};

export default GaugeChart;
