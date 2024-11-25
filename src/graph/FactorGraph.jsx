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
            grid: { containLabel: true },
            xAxis: { name: 'Factor Value' },
            yAxis: { type: 'category', name: 'Factor' },
            visualMap: {
                orient: 'horizontal',
                left: 'center' ,
                min: 10,
                max: 100,
                text: ['High', 'Low'],
                dimension: 0,
                inRange: {
                    color: ['#65B581', '#FFCE34', '#FD665F'],
                },
            },
            series: [
                {
                    type: 'bar',
                    encode: {
                        x: 'Value',
                        y: 'Factor',
                    },
                },
            ],
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [factorsData]); // Re-run when factorsData changes

    return (    
        <div>
            {/* The div where the chart will be rendered */}
            <div id="factor-graph" className="w-[680px] bg-white h-[454px] rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)]"></div>
        </div>
    );
};

export default FactorGraph;
