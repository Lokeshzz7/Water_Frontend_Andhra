import React from 'react';
import WaterInfoCard from './WaterInfoCard';
import WaterLinearCurrent from './WaterLinearCurrent';

const ScenarioSection = ({ title }) => (
  <section className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
    <h2 className="self-center text-4xl font-black text-white">{title}</h2>
    <WaterLinearCurrent />
    
  </section>
);

export default ScenarioSection;