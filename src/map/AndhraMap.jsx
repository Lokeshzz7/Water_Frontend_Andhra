import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

// List of states with index values and static population data
const states = [
    { label: 'Chandigarh', value: 0, population: 1055450 },
    { label: 'Arunachal Pradesh', value: 1, population: 1570458 },
    { label: 'Odisha', value: 2, population: 45333632 },
    { label: 'Manipur', value: 3, population: 3162322 },
    { label: 'Rajasthan', value: 4, population: 81032689 },
    { label: 'Bihar', value: 5, population: 124799926 },
    { label: 'Telangana', value: 6, population: 39237488 },
    { label: 'Puducherry', value: 7, population: 1554000 },
    { label: 'Lakshadweep', value: 8, population: 64473 },
    { label: 'Ladakh', value: 9, population: 290492 },
    { label: 'Kerala', value: 10, population: 35699443 },
    { label: 'Andaman and Nicobar Islands', value: 11, population: 399001 },
    { label: 'Maharashtra', value: 12, population: 125848620 },
    { label: 'Uttar Pradesh', value: 13, population: 240928138 },
    { label: 'Mizoram', value: 14, population: 1267403 },
    { label: 'Uttarakhand', value: 15, population: 12033385 },
    { label: 'Andhra Pradesh', value: 16, population: 54004482 },
    { label: 'Haryana', value: 17, population: 29482700 },
    { label: 'Dadra and Nagar Haveli', value: 18, population: 867000 },
    { label: 'Himachal Pradesh', value: 19, population: 7541833 },
    { label: 'Karnataka', value: 20, population: 69799967 },
    { label: 'Jammu and Kashmir', value: 21, population: 12548926 },
    { label: 'Chhattisgarh', value: 22, population: 29842556 },
    { label: 'Meghalaya', value: 23, population: 3894783 },
    { label: 'Delhi', value: 24, population: 32907078 },
    { label: 'Tripura', value: 25, population: 3673917 },
    { label: 'West Bengal', value: 26, population: 100671217 },
    { label: 'Assam', value: 27, population: 35678084 },
    { label: 'Madhya Pradesh', value: 28, population: 87652982 },
    { label: 'Nagaland', value: 29, population: 2340458 },
    { label: 'Goa', value: 30, population: 1619565 },
    { label: 'Daman and Diu', value: 31, population: 243000 },
    { label: 'Jharkhand', value: 32, population: 39434820 },
    { label: 'Sikkim', value: 33, population: 690251 },
    { label: 'Tamil Nadu', value: 34, population: 83141510 },
    { label: 'Gujarat', value: 35, population: 70512524 },
    { label: 'Punjab', value: 36, population: 31978408 },
];

const AndraMap = () => {
    const [selectedState, setSelectedState] = useState(null);
    const [totalPopulation, setTotalPopulation] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        const storedStateIndex = localStorage.getItem("selectedState");
        const storedYear = localStorage.getItem("selectedYear");

        if (storedStateIndex !== null) {
            const state = states.find((state) => state.value === parseInt(storedStateIndex, 10));
            if (state) {
                setSelectedState(state.label);
                setTotalPopulation(state.population);
            }
        }

        if (storedYear !== null) {
            setSelectedYear(storedYear);
        }
    }, []);

    useEffect(() => {
        if (!selectedState || totalPopulation === null) return;

        const initializeChart = async () => {
            const chartDom = document.getElementById("main");
            const myChart = echarts.init(chartDom);
            myChart.showLoading();

            try {
                const response = await fetch(
                    "https://sharonadhitya.github.io/json/Indian_States%20[MConverter.eu].json"
                );
                const indiaGeoJson = await response.json();
                const stateFeature = indiaGeoJson.features.find(
                    (feature) => feature.properties.NAME_1 === selectedState
                );

                if (stateFeature) {
                    const stateGeoJson = {
                        type: "FeatureCollection",
                        features: [stateFeature],
                    };

                    echarts.registerMap(selectedState, stateGeoJson);

                    myChart.hideLoading();

                    const option = {
                        title: {
                            text: `${selectedState} Map`,
                            subtext: `Population Data: ${totalPopulation.toLocaleString()}`,
                            left: "center",
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: (params) =>
                                `${params.name}<br/>Population: ${totalPopulation.toLocaleString()}`,
                        },
                        visualMap: {
                            min: 0,
                            max: 200000000,
                            text: ["High", "Low"],
                            realtime: false,
                            calculable: true,
                            inRange: {
                                color: ["lightskyblue", "yellow", "orangered"],
                            },
                        },
                        series: [
                            {
                                name: selectedState,
                                type: "map",
                                map: selectedState,
                                emphasis: {
                                    label: {
                                        show: true,
                                    },
                                },
                                data: [
                                    { name: selectedState, value: totalPopulation },
                                ],
                            },
                        ],
                    };

                    myChart.setOption(option);
                } else {
                    console.error(`${selectedState} not found in the GeoJSON data.`);
                }
            } catch (error) {
                console.error("Failed to fetch India GeoJSON:", error);
            }
        };

        initializeChart();
    }, [selectedState, totalPopulation]);

    return <div id="main" className="w-full h-[520px] p-2 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue rounded-lg mt-8"></div>;
};

export default AndraMap;
