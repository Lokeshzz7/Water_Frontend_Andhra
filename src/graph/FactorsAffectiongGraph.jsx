import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const FactorsGraph = () => {
  useEffect(() => {
    // Get the chart DOM element
    const chartDom = document.getElementById('FactorMain');
    const myChart = echarts.init(chartDom);

    // Chart options
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
        dimensions: ['factor', '2015', '2016', '2017'],
        source: [
          { factor: 'Population', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
          { factor: 'Temperature', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
          { factor: 'Rainfall', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
          { factor: 'Evaporation', 2015: 72.4, 2016: 53.9, 2017: 39.1 },
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
        { type: 'bar' },
      ],
    };

    // Set the chart option
    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div className="relative h-0">
      {/* Info button */}
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

      {/* Chart container */}
      <div
        id="FactorMain"
        className="w-[650px] ml-6  pt-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-[#0b1437] h-[330px] rounded-lg"
      ></div>
    </div>
  );
};

export default FactorsGraph;
