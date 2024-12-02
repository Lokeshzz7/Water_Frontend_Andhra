import React, { useEffect, useRef, useState } from "react";
import resData from "./reservoir_data_full.json";
import DataCard from "../component/DataCard";

const StateMap = () => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const polygonSeriesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoomState, setCurrentZoomState] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stateReservoirCount, setStateReservoirCount] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  const scripts = [
    "https://cdn.amcharts.com/lib/5/index.js",
    "https://cdn.amcharts.com/lib/5/map.js",
    "https://cdn.amcharts.com/lib/5/geodata/indiaLow.js",
    "https://cdn.amcharts.com/lib/5/themes/Animated.js",
  ];

  const stateBoundaries = {
    "Andhra Pradesh": { latMin: 12.5, latMax: 19.5, lonMin: 76.5, lonMax: 84.5 },
    "Tamil Nadu": { latMin: 8.1, latMax: 13.5, lonMin: 76.0, lonMax: 80.5 },
    "Karnataka": { latMin: 11.6, latMax: 18.5, lonMin: 74.0, lonMax: 78.5 },
    "Kerala": { latMin: 8.0, latMax: 12.5, lonMin: 74.5, lonMax: 77.5 },
    "Maharashtra": { latMin: 15.6, latMax: 22.1, lonMin: 72.5, lonMax: 80.9 },
    "Gujarat": { latMin: 20.0, latMax: 24.7, lonMin: 68.0, lonMax: 74.5 },
    "Rajasthan": { latMin: 23.3, latMax: 30.1, lonMin: 69.0, lonMax: 78.2 },
    "Punjab": { latMin: 29.5, latMax: 32.5, lonMin: 73.8, lonMax: 76.8 },
    "Haryana": { latMin: 28.4, latMax: 30.8, lonMin: 74.3, lonMax: 77.4 },
    "Uttar Pradesh": { latMin: 24.6, latMax: 30.9, lonMin: 77.0, lonMax: 84.5 },
    "Bihar": { latMin: 24.4, latMax: 27.5, lonMin: 83.0, lonMax: 88.0 },
    "Jharkhand": { latMin: 22.0, latMax: 25.5, lonMin: 83.3, lonMax: 87.5 },
    "West Bengal": { latMin: 21.5, latMax: 27.2, lonMin: 85.8, lonMax: 89.9 },
    "Odisha": { latMin: 19.0, latMax: 22.5, lonMin: 81.5, lonMax: 87.5 },
    "Chhattisgarh": { latMin: 17.9, latMax: 24.1, lonMin: 80.2, lonMax: 84.5 },
    "Madhya Pradesh": { latMin: 21.2, latMax: 26.9, lonMin: 74.0, lonMax: 82.5 },
    "Assam": { latMin: 24.5, latMax: 28.5, lonMin: 89.5, lonMax: 96.1 },
    "Meghalaya": { latMin: 25.1, latMax: 26.5, lonMin: 89.0, lonMax: 92.5 },
    "Nagaland": { latMin: 25.6, latMax: 27.4, lonMin: 93.3, lonMax: 95.2 },
    "Manipur": { latMin: 23.8, latMax: 25.7, lonMin: 93.0, lonMax: 94.8 },
    "Mizoram": { latMin: 21.6, latMax: 24.4, lonMin: 92.3, lonMax: 93.3 },
    "Tripura": { latMin: 22.9, latMax: 24.5, lonMin: 91.0, lonMax: 92.5 },
    "Sikkim": { latMin: 27.0, latMax: 28.1, lonMin: 88.0, lonMax: 89.1 },
    "Arunachal Pradesh": { latMin: 26.0, latMax: 29.3, lonMin: 91.5, lonMax: 97.5 },
    "Telangana": { latMin: 16.3, latMax: 19.8, lonMin: 77.0, lonMax: 81.8 },
    "Goa": { latMin: 14.9, latMax: 15.8, lonMin: 73.7, lonMax: 74.2 },
    "Himachal Pradesh": { latMin: 30.3, latMax: 33.0, lonMin: 75.8, lonMax: 79.0 },
    "Uttarakhand": { latMin: 29.1, latMax: 31.3, lonMin: 78.0, lonMax: 81.0 },
    "Jammu and Kashmir": { latMin: 32.5, latMax: 37.1, lonMin: 74.5, lonMax: 80.2 },
    "Ladakh": { latMin: 32.0, latMax: 36.5, lonMin: 76.0, lonMax: 80.0 },
    "Delhi": { latMin: 28.4, latMax: 28.9, lonMin: 76.8, lonMax: 77.3 }
  };

  const updateStateReservoirCount = (stateName) => {
    const boundaries = stateBoundaries[stateName];
    if (!boundaries) {
      console.warn(`Boundaries not defined for state: ${stateName}`);
      setStateReservoirCount(0);
      return;
    }

    const reservoirsInState = resData.filter((reservoir) => {
      const [lon, lat] = reservoir.geometry.coordinates;
      return (
        lat >= boundaries.latMin &&
        lat <= boundaries.latMax &&
        lon >= boundaries.lonMin &&
        lon <= boundaries.lonMax
      );
    });

    setStateReservoirCount(reservoirsInState.length);
  };

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

    polygonSeriesRef.current = polygonSeries; // Save reference for later use

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
      polygonSeriesRef.current.mapPolygons.each((polygon) => {
        polygon.states.apply("default");
      });

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

    const states = [
      { id: "IN-AP", name: "Andhra Pradesh" },
      { id: "IN-AR", name: "Arunachal Pradesh" },
      { id: "IN-AS", name: "Assam" },
      { id: "IN-BR", name: "Bihar" },
      { id: "IN-CT", name: "Chhattisgarh" },
      { id: "IN-GA", name: "Goa" },
      { id: "IN-GJ", name: "Gujarat" },
      { id: "IN-HR", name: "Haryana" },
      { id: "IN-HP", name: "Himachal Pradesh" },
      { id: "IN-JH", name: "Jharkhand" },
      { id: "IN-KA", name: "Karnataka" },
      { id: "IN-KL", name: "Kerala" },
      { id: "IN-MP", name: "Madhya Pradesh" },
      { id: "IN-MH", name: "Maharashtra" },
      { id: "IN-MN", name: "Manipur" },
      { id: "IN-ML", name: "Meghalaya" },
      { id: "IN-MZ", name: "Mizoram" },
      { id: "IN-NL", name: "Nagaland" },
      { id: "IN-OR", name: "Odisha" },
      { id: "IN-PB", name: "Punjab" },
      { id: "IN-RJ", name: "Rajasthan" },
      { id: "IN-SK", name: "Sikkim" },
      { id: "IN-TN", name: "Tamil Nadu" },
      { id: "IN-TG", name: "Telangana" },
      { id: "IN-TR", name: "Tripura" },
      { id: "IN-UP", name: "Uttar Pradesh" },
      { id: "IN-UT", name: "Uttarakhand" },
      { id: "IN-WB", name: "West Bengal" },
    ];
    setStateList(states);

    setIsLoading(false);
  };
  const handleStateSelection = (stateId) => {
    const selectedState = stateList.find((state) => state.id === stateId);
    if (selectedState) {
      setSelectedState(stateId);
      setSelectedItem({ type: "state", name: selectedState.name });
      updateStateReservoirCount(selectedState.name);

      // Programmatically zoom to the selected state
      const dataItem = polygonSeriesRef.current.getDataItemById(stateId);
      if (dataItem) {
        polygonSeriesRef.current.zoomToDataItem(dataItem); // Correct method here
        setCurrentZoomState(dataItem);
      }
    }
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
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      // Custom event listener
      if (e.detail && e.detail.key === "StateMapId") {
        const stateMapId = e.detail.value;
        if (stateList.length > 0) {
          handleStateSelection(stateMapId);
        }
      }
    };

    // Add custom event listener
    window.addEventListener("localStorageChange", handleStorageChange);

    // Modify localStorage setting to trigger custom event
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      const event = new CustomEvent("localStorageChange", {
        detail: { key, value }
      });
      window.dispatchEvent(event);

      // Call the original setItem method
      originalSetItem.apply(this, arguments);
    };

    // Check initial localStorage value
    const initialStateMapId = localStorage.getItem("StateMapId");
    if (initialStateMapId && stateList.length > 0) {
      handleStateSelection(initialStateMapId);
    }

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange);
      // Restore original setItem method
      localStorage.setItem = originalSetItem;
    };
  }, [stateList]); // Include stateList as a dependency if you need it to re-run based on changes




  return (
    <div className="flex w-full h-[500px]">
      <div id="chartdiv" ref={chartRef} className="w-[60%] h-full" />
      <div className="w-[40%] h-full bg-transparent text-white p-4 border-l">
        {selectedItem ? (
          selectedItem.type === "reservoir" ? (
            <div className="flex w-full h-40">
              <DataCard title={`Reservoir: ${selectedItem.title}`} value="N/A" />
              {/*<button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>*/}
            </div>
          ) : selectedItem.type === "state" ? (
            <div className="flex w-full h-40">
            <DataCard
              title={`State: ${selectedItem.name}`}
              value={`Reservoirs: ${stateReservoirCount}`}
            />
              {/*<button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>*/}
            </div>
          ) : null
        ) : (
          <p>Select a state or reservoir for details.</p>
        )}
      </div>
    </div>
  );
};

export default StateMap;

