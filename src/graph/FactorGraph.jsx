import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import data from '../data/risk_assessment_fake_data.json'; // Assuming the data is imported

const FactorGraph = () => {
    const [factorsData, setFactorsData] = useState({});
    const [selectedStateIndex, setSelectedStateIndex] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        // Function to get data from localStorage
        const loadFromLocalStorage = () => {
            const stateIndex = parseInt(localStorage.getItem('selectedState'), 10);
            const year = parseInt(localStorage.getItem('selectedYear'), 10);
            setSelectedStateIndex(stateIndex);
            setSelectedYear(year);
        };

        // Initial load from localStorage
        loadFromLocalStorage();

        // Listen for storage changes
        window.addEventListener('storage', loadFromLocalStorage);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('storage', loadFromLocalStorage);
        };
    }, []); // Empty array to run only once on component mount

    useEffect(() => {
        if (selectedStateIndex === null || selectedYear === null) return;

        // Filter data based on state index and year
        const filteredData = data.find(
            (item) => item.index === selectedStateIndex && item.year === selectedYear
        );

        if (filteredData) {
            console.log("Filtered data:", filteredData);
            setFactorsData({
                flood_level: filteredData.flood_level,
                drought_level: filteredData.drought_level,
                evaporation: filteredData.evaporation,
            });
        } else {
            console.log("No data found for the selected state and year.");
        }

    }, [selectedStateIndex, selectedYear]); // Re-run when localStorage values change

    useEffect(() => {
        if (!factorsData || Object.keys(factorsData).length === 0) return;

        console.log("Factors Data for Chart: ", factorsData); // Check data before chart rendering

        const chartDom = document.getElementById('factor-graph');
        const myChart = echarts.init(chartDom);

        // Get min and max values dynamically from the data
        const values = [
            factorsData.flood_level,
            factorsData.drought_level,
            factorsData.evaporation,
        ];

        const chartData = [
            ['Value', 'Factor'],
            [factorsData.flood_level || 0, 'Flood Level'],
            [factorsData.drought_level || 0, 'Drought Level'],
            [factorsData.evaporation || 0, 'Evaporation'],
        ];

        const option = {
            dataset: {
                source: chartData,
            },
            grid: {
                containLabel: true,
                right: '20%', // Move the entire chart (including labels) to the left by 10%
                top: '20%',
            },
            xAxis: {
                name: 'Factor Value',
                nameTextStyle: {
                    color: 'white', // Set the x-axis label color to white
                    fontWeight: 'bold', // Make the font bold
                },
                axisLabel: {
                    color: 'white', // Set the axis labels to white
                    fontWeight: 'bold', // Make axis labels bold
                },
            },
            yAxis: {
                type: 'category',
                name: 'Factor',
                nameTextStyle: {
                    color: 'white', // Set the y-axis label color to white
                    fontWeight: 'bold', // Make the font bold
                },
                axisLabel: {
                    color: 'white', // Set the axis labels to white
                    fontWeight: 'bold', // Make axis labels bold
                },
            },
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                min: 10,
                max: 100,
                text: ['High', 'Low'],
                dimension: 0,
                inRange: {
                    color: ['#65B581', '#FFCE34', '#FD665F'],
                },
                textStyle: {
                    color: 'white', // Set the text color for visual map to white
                    fontWeight: 'bold', // Make the text bold
                },
            },
            series: [
                {
                    type: 'bar',
                    encode: {
                        x: 'Value',
                        y: 'Factor',
                    },
                    itemStyle: {
                        color: 'white', // Set the bar color to white (optional)
                    },
                    tooltip: {
                        trigger: 'item', // Trigger tooltip when hovering over an item
                        formatter: function (params) {
                            return `
                                <div>
                                    <strong>Factor:</strong> ${params.data.Factor}<br/>
                                    <strong>Value:</strong> ${params.data.Value}
                                </div>
                            `;
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for the tooltip
                        borderColor: '#fff', // White border color
                        borderWidth: 1, // Border width
                        textStyle: {
                            color: '#fff', // Set tooltip text color to white
                            fontSize: 14, // Font size for the tooltip
                        },
                    },
                },
            ],
            toolbox: {
                show: true, // Show the toolbox
                feature: {
                    saveAsImage: {
                        backgroundColor: 'transparent',
                    },
                    myInfoButton: { // Custom info button
                        show: true,
                        title: 'Info', // Button title
                        icon: 'path://M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zM256 448C132.48 448 48 363.52 48 256S132.48 64 256 64s208 84.48 208 192-84.48 192-208 192zM256 176c-13.28 0-24 10.72-24 24s10.72 24 24 24 24-10.72 24-24-10.72-24-24-24zM256 272c-13.28 0-24 10.72-24 24s10.72 24 24 24 24-10.72 24-24-10.72-24-24-24z',
                        onclick: function () {
                            // Create an info box when the info button is clicked
                            const infoBox = document.createElement('div');
                            infoBox.style.position = 'relative';
                            infoBox.style.backgroundColor = 'white'; // White background
                            infoBox.style.color = 'black'; // Black text
                            infoBox.style.padding = '15px';
                            infoBox.style.borderRadius = '5px';
                            infoBox.style.zIndex = 9999;
                            infoBox.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
                            infoBox.style.fontSize = '12px';
                            infoBox.style.width = '250px';
                            infoBox.style.top = '10px';
                            infoBox.style.right = '10px';

                            // Content of the info box
                            infoBox.innerHTML = `
                                <strong>Graph Information</strong><br/>
                                This graph visualizes the relationship between different factors and their values over time.<br/>
                                It helps to analyze trends and patterns.
                            `;

                            // Add the info box to the body
                            document.body.appendChild(infoBox);

                            // Automatically hide the info box after 5 seconds
                            setTimeout(() => {
                                document.body.removeChild(infoBox);
                            }, 5000);
                        },
                    },

                },
                itemSize: 18, // Optional: Adjust the size of toolbox icons
                top: '1%', // Position the toolbox from the top (you can adjust this)
                right: '2%', // Position the toolbox from the right (you can adjust this)
            },
            title: {
                text: 'Factors Affecting',
                textStyle: {
                    color: "white", // Set title color to white
                    fontWeight: "bold", // Set title font weight to bold
                    fontSize: 24, // Optional: Set title font size
                },
                padding: [15, 0, 20, 20],
            },
            legend: {
                textStyle: {
                    color: 'white', // Set the legend text color to white
                    fontWeight: 'bold', // Make the legend text bold
                },
            },
        };



        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [factorsData]); // Re-run when factorsData changes

    return (
        <div>
            {/* The div where the chart will be rendered */}
            <div id="factor-graph" className="w-[680px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue h-[454px] rounded-lg ml-6 mt-8 mr-4  "></div>
        </div>
    );
};

export default FactorGraph;
