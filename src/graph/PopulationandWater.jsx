import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_indiaLow from "@amcharts/amcharts5-geodata/indiaLow";

const IndiaMap = () => {
    useEffect(() => {
        // Create root element
        const root = am5.Root.new("chartdiv");

        // Set themes
        root.setThemes([am5themes_Animated.new(root)]);

        // Create the map chart
        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "rotateX",
                projection: am5map.geoMercator(),
            })
        );

        // Create polygon series for India
        const indiaSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_indiaLow,
            })
        );

        indiaSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true,
        });

        // Add hover effect
        indiaSeries.mapPolygons.template.states.create("hover", {
            fill: root.interfaceColors.get("primaryButtonActive"),
        });

        // Drill-down logic
        indiaSeries.mapPolygons.template.events.on("click", (event) => {
            const stateData = event.target.dataItem.dataContext;
            drillDownToState(stateData);
        });

        // Function for drill-down to states
        const drillDownToState = (stateData) => {
            // Remove India map
            chart.series.removeValue(indiaSeries);

            // Create a series for the selected state
            const stateSeries = chart.series.push(
                am5map.MapPolygonSeries.new(root, {
                    geoJSON: am5geodata_indiaLow, // Can replace with state-specific GeoJSON
                    include: [stateData.id],
                })
            );

            stateSeries.mapPolygons.template.setAll({
                tooltipText: "{name}",
                interactive: true,
            });

            // Add hover effect
            stateSeries.mapPolygons.template.states.create("hover", {
                fill: root.interfaceColors.get("primaryButtonActive"),
            });

            // Add a back button
            const backButton = chart.children.push(
                am5.Button.new(root, {
                    paddingTop: 10,
                    paddingBottom: 10,
                    x: am5.percent(100),
                    centerX: am5.percent(100),
                    icon: am5.Graphics.new(root, {
                        svgPath:
                            "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
                        fill: am5.color(0xffffff),
                    }),
                })
            );

            backButton.events.on("click", () => {
                chart.series.removeValue(stateSeries);
                chart.series.push(indiaSeries);
                backButton.hide();
            });

            backButton.show();
        };

        return () => {
            root.dispose();
        };
    }, []);

    return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default IndiaMap;
