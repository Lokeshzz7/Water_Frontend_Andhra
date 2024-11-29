import React, { useEffect, useRef, useState } from "react";
import resData from "./reservoir_data_full.json"; // Adjust the path to where your resData is located

const StateMap = () => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const polygonSeriesRef = useRef(null); // Store polygon series reference
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoomState, setCurrentZoomState] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stateReservoirCount, setStateReservoirCount] = useState(null);
  const [stateList, setStateList] = useState([]); // List of states for the dropdown
  const [selectedState, setSelectedState] = useState(null); // Dropdown selection

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

  const updateStateReservoirCount = (stateName) => {
    const stateReservoirs = resData.filter(
      (reservoir) => reservoir.state === stateName
    );
    setStateReservoirCount(stateReservoirs.length);
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
            <div id="chartdiv" ref={chartRef} className="w-3/4 h-full" />

            <div className="w-1/4 h-full bg-transparent text-white p-4 border-l">
                {selectedItem ? (
                    selectedItem.type === "reservoir" ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">Reservoir Details</h2>
                            <p><strong>Name:</strong> {selectedItem.title}</p>
                            <p><strong>Capacity:</strong> {selectedItem.capacity} MCM</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => setSelectedItem(null)}
                            >
                                Close
                            </button>
                        </>
                    ) : selectedItem.type === "state" ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">State Details</h2>
                            <p><strong>State:</strong> {selectedItem.name}</p>
                            <p><strong>Number of Reservoirs:</strong> {stateReservoirCount}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => setSelectedItem(null)}
                            >
                                Close
                            </button>
                        </>
                    ) : null
                ) : (
                    <p>Select a state or reservoir for details.</p>
                )}
            </div>
        </div>
    );
};

export default StateMap;
