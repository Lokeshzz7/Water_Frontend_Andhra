import React from 'react';
import DoughnutChart from './charts/Doughnut';
import GaugeChart from './charts/Score';
import FactorGraph from '../graph/FactorGraph';

const DataVisualizations = () => {
  return (
    <main className="flex overflow-hidden flex-col h-full justify-evenly items-center max-md:px-5">
      <section className=" w-full max-w-[1950px] max-md:max-w-full">
        <div className="flex max-md:flex-col">
          {/* <WaterUsageCard /> */}
          <GaugeChart />
        </div>
      </section>
      <section className="mt-17 w-full max-w-[1950px] max-md:max-w-full">
        <div className="flex max-md:flex-col">
          <FactorGraph />
        </div>
      </section>
    </main>
  );
};

export default DataVisualizations;