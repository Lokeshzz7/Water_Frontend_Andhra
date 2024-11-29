import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import FactorGraph from './FactorGraph';

const FactorsGraph = () => {
  useEffect(() => {
    // Get the chart DOM element
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    // Chart options
    const option = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['product', '2015', '2016', '2017'],
        source: [
          { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
          { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
          { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
          { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 },
        ],
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
    };

    // Set the chart option
    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div
      id="main"
      style={{
        width: '100%',
        height: '400px', // Adjust the height as needed
      }}
    ></div>
  );
};

export default FactorsGraph;
