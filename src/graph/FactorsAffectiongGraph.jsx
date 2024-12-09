import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

const FactorsGraph = () => {
  const [description, setDescription] = useState('');
  const [insights, setInsights] = useState({
    interpretation: '',
    insights: '',
    recommendations: '',
  });

  // Function to generate description based on risk factors
  const getRiskFactorsDescription = (rainfall, populationGrowth, landUse) => {
    // Identify the highest and lowest contributing factors
    const factors = [
      { name: 'Rainfall', value: rainfall },
      { name: 'Population Growth', value: populationGrowth },
      { name: 'Land Use', value: landUse },
    ];

    const highestFactor = factors.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
    const lowestFactor = factors.reduce((prev, curr) => (curr.value < prev.value ? curr : prev));

    return {
      interpretation: `This bar chart shows the contribution of various factors to overall risk levels. The most significant contributor to the risk is **${highestFactor.name}**, with a value of **${highestFactor.value}**, indicating its primary role in shaping the risk scenario. On the other hand, **${lowestFactor.name}** with a value of **${lowestFactor.value}** contributes the least, though it still plays a role in the overall risk.`,
      insights: `The **${highestFactor.name}** factor has the largest impact on the overall risk, making it the key focus for any mitigation strategies. The **${lowestFactor.name}** factor still contributes but should be monitored for any future changes.`,
      recommendations: 'To manage the risk effectively, prioritize addressing the factors with the highest influence (like **' + highestFactor.name + '**) and prepare for any changes in the lower-impact factors (like **' + lowestFactor.name + '**). Implement strategies to maintain a balanced approach toward managing all factors.',
    };
  };

  useEffect(() => {
    // Generate a sample description based on example data
    const exampleData = {
      rainfall: 75, // Example value
      populationGrowth: 50, // Example value
      landUse: 30, // Example value
    };
    const generatedDescription = getRiskFactorsDescription(
      exampleData.rainfall,
      exampleData.populationGrowth,
      exampleData.landUse
    );
    setDescription(generatedDescription.interpretation);
    setInsights(generatedDescription);

    // Initialize the chart
    const chartDom = document.getElementById('FactorMain');
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Factors',
        left: 'center',
        top: 5,
        textStyle: {
          color: '#ffffff',
        },
      },
      legend: {
        textStyle: {
          color: '#ffffff',
        },
        top: '30px',
      },
      tooltip: {
        textStyle: {
          color: 'black',
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save as Image',
            pixelRatio: 2,
            backgroundColor: '#0b1437',
            iconStyle: {
              borderColor: '#ffffff',
            },
          },
        },
        top: 10,
        right: 10,
      },
      dataset: {
        dimensions: ['factor', '2023', '2024'],
        source: [
          { factor: 'Population', 2023: 43.3,2024: 93.7 },
          { factor: 'Temperature', 2023: 83.1, 2024: 55.1 },
          { factor: 'Rainfall', 2023: 86.4, 2024: 82.5 },
        ],
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#ffffff',
        },
      },
      yAxis: {
        axisLabel: {
          color: '#ffffff',
        },
      },
      series: [
        { type: 'bar' },
        { type: 'bar' },
      ],
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute left-7 z-[100] text-white p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        onMouseEnter={() => {
          const tooltip = document.getElementById('factorTooltip');
          if (tooltip) tooltip.style.display = 'block';
        }}
        onMouseLeave={() => {
          const tooltip = document.getElementById('factorTooltip');
          if (tooltip) tooltip.style.display = 'none';
        }}
      >
        ℹ️
        <div
          id="factorTooltip"
          className="absolute top-[35px] left-0 p-2 bg-black text-white text-sm rounded shadow-md z-[101]"
          style={{ display: 'none', width: '200px' }}
        >
          This graph shows the distribution of consumption, inflow, and usage categories for the selected district and year.
        </div>
      </div>

      <div
        id="FactorMain"
        className="w-[650px] ml-6 pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
      ></div>

      

      {/* Insights and Recommendations Section */}
      {/* <div className="ml-6 mt-4 text-white p-4 bg-[#1a2238] rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Analysis Summary</h3>
        <p>
          <b>Interpretation:</b> {insights.interpretation}
        </p>
        <p>
          <b>Insights:</b> {insights.insights}
        </p>
        <p>
          <b>Recommendations:</b> {insights.recommendations}
        </p>
      </div> */}
    </div>
  );
};

export default FactorsGraph;
