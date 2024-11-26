import React, { useEffect, useRef, useState } from "react";
import resData from "./reservoir_data_full.json"; // Adjust the path to where your resData is located

const StateMap = () => {
    const chartRef = useRef(null);
    const rootRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentZoomState, setCurrentZoomState] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [stateReservoirCount, setStateReservoirCount] = useState(null);

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
        // Generate random color (RGB format)
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

        const stateColors = {}; // Store color assignments

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
            stroke: window.am5.color(0xffffff),
            strokeWidth: 1,
        });

        // Loop through states and assign colors
        polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
            const stateName = target.dataItem.dataContext.name;
            if (!stateColors[stateName]) {
                // Assign a random color to each state
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
    }, []);

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
