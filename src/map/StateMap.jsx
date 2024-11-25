import React, { useEffect, useRef, useState } from "react";
// Import the resData
import resData from "./reservoir_data_full.json"; // Adjust the path to where your resData is located

const StateMap = () => {
    const chartRef = useRef(null);
    const rootRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentZoomState, setCurrentZoomState] = useState(null);

    const scripts = [
        "https://cdn.amcharts.com/lib/5/index.js",
        "https://cdn.amcharts.com/lib/5/map.js",
        "https://cdn.amcharts.com/lib/5/geodata/indiaLow.js",
        "https://cdn.amcharts.com/lib/5/themes/Animated.js",
    ];

    const loadScript = async (src) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log(`Script already loaded: ${src}`);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = () => {
                console.log(`Successfully loaded: ${src}`);
                resolve();
            };
            script.onerror = (err) => {
                console.error(`Failed to load: ${src}`, err);
                reject(err);
            };
            document.body.appendChild(script);
        });
    };

    const loadAllScripts = async () => {
        try {
            await Promise.all(scripts.map(loadScript));
            console.log("All scripts loaded successfully.");
        } catch (error) {
            console.error("Error loading scripts:", error);
        }
    };

    const initializeChart = () => {
        console.log("Initializing chart...");
        if (
            !window.am5 ||
            !window.am5map ||
            !window.am5themes_Animated ||
            !window.am5geodata_indiaLow
        ) {
            console.error("Required amCharts libraries are missing.");
            return;
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

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
            fill: window.am5.color(0x74b9ff),
            stroke: window.am5.color(0xffffff),
            strokeWidth: 1,
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: window.am5.color(0x0984e3),
        });

        // Add click event for zooming functionality
        polygonSeries.mapPolygons.template.events.on("click", function (ev) {
            const dataItem = ev.target.dataItem;

            // Check if the clicked state is already zoomed in
            if (dataItem === currentZoomState) {
                chart.goHome(); // Reset zoom to show full map of India
                setCurrentZoomState(null); // Clear the zoom state
            } else {
                polygonSeries.zoomToDataItem(dataItem); // Zoom to the clicked state
                setCurrentZoomState(dataItem); // Save the current zoomed state
            }
        });

        // Add zoom control
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

            return window.am5.Bullet.new(root, {
                sprite: circle,
            });
        });

        // Use resData for placing reservoirs on the map
        reservoirSeries.data.setAll(resData);

        polygonSeries.events.on("datavalidated", () => {
            chart.goHome();
        });

        setIsLoading(false);
    };

    useEffect(() => {
        let root;

        const setupChart = async () => {
            await loadAllScripts();
            initializeChart();
        };

        setupChart();

        return () => {
            if (rootRef.current) {
                rootRef.current.dispose();
            }
            rootRef.current = null;
        };
    }, []);

    return (
        <div
            id="chartdiv"
            ref={chartRef}
            className="w-full h-[500px]"
        />
    );
};

export default StateMap;
