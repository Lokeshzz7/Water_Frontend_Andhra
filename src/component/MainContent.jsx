import React from 'react';
import ScenarioSection from './Scenario_text_section';
import GaugeChart from './charts/Score';
import SideBar from './charts/SideBar';
import ScenarioDropdown from './ScenarioDropdown';
import ScenarioSlider from '../graph/ScenarioSlider';
import WaterLinearCurrent from './WaterLinearCurrent';
import LucGraph from '../graph/LucGraph';
import WaterLinear from './WaterLinear';
const MainContent = () => (
  <main className="mt-2 max-md:max-w-full">
    <div className='flex flex-row gap-3 w-1/2'>
      <ScenarioDropdown />
      <ScenarioSlider />
    </div>
    <div className="flex gap-5 mt-4 max-md:flex-col">

      {/* Left side  */}
      <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
            <section className="mt-17 w-full max-w-[1600px] max-md:max-w-full">
                <div className="flex gap-8 max-md:flex-col">
                    {/* <WaterUsageCard /> */}
                    <WaterLinearCurrent />
                    <WaterLinear />
                </div>
              </section>
              <section className="mt-17 w-full max-w-[1600px] max-md:max-w-full">
                <div className="flex gap-8 max-md:flex-col">
                    <LucGraph />
                </div>
              </section>
      </main>
      {/* Right Side */}
      <aside className="flex flex-col ml-5 w-[29%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col grow mt-3 font-bold text-black max-md:mt-10">
          <div className="px-14 pt-2.5 text-5xl tracking-tighter leading-none bg-stone-300 max-md:px-5 max-md:pb-28 max-md:text-4xl">
            Scenario Score
            <GaugeChart />
          </div>
          <div className="px-1 pt-5 pb-20 mt-7 text-4xl tracking-tighter leading-none bg-stone-300 max-md:pr-5 max-md:pb-28">
            Factors affecting the scenario:
            <SideBar />
          </div>
        </div>
      </aside>


    </div>
  </main>
);

export default MainContent;