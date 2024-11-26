import React, { useEffect, useRef, useState } from "react";
import resData from "./reservoir_data_full.json";

const StateMap = ({ selectedStateId }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoomState, setCurrentZoomState] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stateReservoirCount, setStateReservoirCount] = useState(null);

  // Mapping your custom dropdown IDs to GeoJSON state IDs
  const stateIdMap = {
    0: "IN-CH", // Chandigarh
    1: "IN-AR", // Arunachal Pradesh
    2: "IN-OD", // Odisha
    3: "IN-MN", // Manipur
    4: "IN-RJ", // Rajasthan
    5: "IN-BR", // Bihar
    6: "IN-TS", // Telangana
    7: "IN-PY", // Puducherry
    8: "IN-LD", // Lakshadweep
    9: "IN-LD", // Ladakh
    10: "IN-KL", // Kerala
    11: "IN-AN", // Andaman and Nicobar Islands
    12: "IN-MH", // Maharashtra
    13: "IN-UP", // Uttar Pradesh
    14: "IN-MZ", // Mizoram
    15: "IN-UT", // Uttarakhand
    16: "IN-AP", // Andhra Pradesh
    17: "IN-HR", // Haryana
    18: "IN-DN", // Dadra and Nagar Haveli
    19: "IN-HP", // Himachal Pradesh
    20: "IN-KA", // Karnataka
    21: "IN-JK", // Jammu and Kashmir
    22: "IN-CT", // Chhattisgarh
    23: "IN-ML", // Meghalaya
    24: "IN-DL", // Delhi
    25: "IN-TR", // Tripura
    26: "IN-WB", // West Bengal
    27: "IN-AS", // Assam
    28: "IN-MP", // Madhya Pradesh
    29: "IN-NL", // Nagaland
    30: "IN-GA", // Goa
    31: "IN-DD", // Daman and Diu
    32: "IN-JH", // Jharkhand
    33: "IN-SK", // Sikkim
    34: "IN-TN", // Tamil Nadu
    35: "IN-GJ", // Gujarat
    36: "IN-PB", // Punjab
  };

  const scripts = [
    "https://cdn.amcharts.com/lib/5/index.js",
    "https://cdn.amcharts.com/lib/5/map.js",
    "https://cdn.amcharts.com/lib/5/geodata/indiaLow.js",
    "https://cdn.amcharts.com/lib/5/themes/Animated.js",
  ];

  const loadScript = async (src) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const loadAllScripts = async () => {
    try {
      await Promise.all(scripts.map(loadScript));
    } catch (error) {
      console.error("Error loading scripts:", error);
    }
  };

  const generateRandomColor = () => {
    const random = () => Math.floor(Math.random() * 256);
    return `rgb(${random()}, ${random()}, ${random()})`;
  };

  const initializeChart = () => {
    if (
      !window.am5 ||
      !window.am5map ||
      !window.am5themes_Animated ||
      !window.am5geodata_indiaLow
    ) {
      console.error("Required amCharts libraries are missing.");
      return;
    }

    if (rootRef.current) {
      rootRef.current.dispose();
    }

    const root = window.am5.Root.new("chartdiv");
    rootRef.current = root;

    root.setThemes([window.am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      window.am5map.MapChart.new(root, {
        projection: window.am5map.geoMercator(),
        panX: "translateX",
        panY: "translateY",
        wheelY: "zoom",
      })
    );

    const polygonSeries = chart.series.push(
      window.am5map.MapPolygonSeries.new(root, {
        geoJSON: window.am5geodata_indiaLow,
      })
    );

    const stateColors = {};

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      stroke: window.am5.color(0xffffff),
      strokeWidth: 1,
    });

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const stateName = target.dataItem.dataContext.name;
      if (!stateColors[stateName]) {
        stateColors[stateName] = window.am5.color(generateRandomColor());
      }
      return stateColors[stateName];
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: window.am5.color(0x0984e3),
    });

    polygonSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target.dataItem;
      const stateName = dataItem.dataContext.name;

      if (dataItem === currentZoomState) {
        chart.goHome();
        setCurrentZoomState(null);
        setSelectedItem(null);
        setStateReservoirCount(null);
      } else {
        polygonSeries.zoomToDataItem(dataItem);
        setCurrentZoomState(dataItem);
        setSelectedItem({ type: "state", name: stateName });
        updateStateReservoirCount(stateName);
      }
    });

    const zoomControl = chart.set(
      "zoomControl",
      window.am5map.ZoomControl.new(root, {})
    );
    zoomControl.homeButton.set("visible", true);

    const reservoirSeries = chart.series.push(
      window.am5map.MapPointSeries.new(root, {})
    );

    reservoirSeries.bullets.push(() => {
      const circle = window.am5.Circle.new(root, {
        radius: 6,
        tooltipText: "{title}",
        tooltipY: 0,
        fill: window.am5.color(0xff0000),
        stroke: window.am5.color(0xffffff),
        strokeWidth: 2,
      });

      circle.events.on("click", (event) => {
        const dataItem = event.target.dataItem;
        setSelectedItem({ type: "reservoir", ...dataItem.dataContext });
      });

      return window.am5.Bullet.new(root, { sprite: circle });
    });

    reservoirSeries.data.setAll(resData);
    setIsLoading(false);

    // Highlight state if selectedStateId is passed
    if (selectedStateId !== null) {
      highlightState(polygonSeries, chart, selectedStateId);
    }
  };

  const highlightState = (polygonSeries, chart, stateId) => {
    const geoJsonStateId = stateIdMap[stateId]; // Map custom ID to geoJSON ID
    const statePolygon = polygonSeries.dataItems.find(
      (dataItem) => dataItem.get("id") === geoJsonStateId
    );

    if (statePolygon) {
      chart.zoomToDataItem(statePolygon);
    } else {
      console.warn(`State with ID ${geoJsonStateId} not found.`);
    }
  };

  const updateStateReservoirCount = (stateName) => {
    const stateReservoirs = resData.filter(
      (reservoir) => reservoir.state === stateName
    );
    setStateReservoirCount(stateReservoirs.length);
  };

  useEffect(() => {
    const setupChart = async () => {
      await loadAllScripts();
      initializeChart();
    };

    setupChart();

    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [selectedStateId]);

  return (
    <div className="flex w-full h-[500px]">
      <div id="chartdiv" ref={chartRef} className="w-3/4 h-full" />
      <div className="w-1/4 h-full bg-transparent text-white p-4 border-l">
        {selectedItem ? (
          selectedItem.type === "reservoir" ? (
            <>
              <h2 className="text-xl font-bold mb-2">Reservoir Details</h2>
              <p><strong>Name:</strong> {selectedItem.title}</p>
              <p><strong>Capacity:</strong> {selectedItem.capacity}</p>
              <p><strong>State:</strong> {selectedItem.state}</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">State Details</h2>
              <p><strong>State:</strong> {selectedItem.name}</p>
              <p>
                <strong>Reservoirs:</strong> {stateReservoirCount || "Loading..."}
              </p>
            </>
          )
        ) : (
          <p>Select a state on the map to view details.</p>
        )}
      </div>
    </div>
  );
};

export default StateMap;
