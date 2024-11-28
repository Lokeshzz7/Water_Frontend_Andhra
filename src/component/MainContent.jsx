import React, { useState } from 'react';
import ScenarioDropdown from './ScenarioDropdown';
import ScenarioSlider from '../graph/ScenarioSlider';
import LucGraph from '../graph/LucGraph';
import GaugeChart from './charts/Score';
import SideBar from './charts/SideBar';
import RangeSlider from '../graph/Slider';
import Scenarioscore from '../graph/Scenarioscore';
import DataCard from './DataCard';

const MainContent = () => {
  // State for the sliders
  const [rainfall, setRainfall] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [population, setPopulation] = useState(100);

  // Slider marks
  const rainfallMarks = [
    { value: 0, label: '0 mm' },
    { value: 50, label: '50 mm' },
    { value: 100, label: '100 mm' },
  ];

  const temperatureMarks = [
    { value: 0, label: '0°C' },
    { value: 20, label: '20°C' },
    { value: 40, label: '40°C' },
  ];

  const populationMarks = [
    { value: 0, label: '0 M' },
    { value: 50, label: '50 M' },
    { value: 100, label: '100 M' },
  ];

  return (
    <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5 w-[1700px]">
      <div className="flex flex-col justify-center items-center p-3 w-full">
        <section className="flex flex-row w-full">
          {/* Left section: Group of sliders */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col justify-between gap-4 px-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component ml-5 mt-7 p-8 pl-10 ">
              {/* Group of three sliders: Rainfall, Temperature, and Population */}
              <div className="flex w-full">
                <div className="flex flex-row gap-9 text-center align-baseline">
                  <span className="text-lg font-bold text-white">Rainfall:</span>
                  <RangeSlider
                    value={rainfall}
                    onChange={setRainfall}
                    marks={rainfallMarks}
                    step={10}
                    min={0}
                    max={100}
                  />
                  <span className="text-lg font-bold text-white">{rainfall} mm</span>
                </div>
              </div>
              <div className="flex w-full">
                <div className="flex flex-row gap-9 text-center align-baseline">
                  <span className="text-lg font-bold text-white">Temperature:</span>
                  <RangeSlider
                    value={temperature}
                    onChange={setTemperature}
                    marks={temperatureMarks}
                    step={5}
                    min={0}
                    max={40}
                  />
                  <span className="text-lg font-bold text-white">{temperature} °C</span>
                </div>
              </div>
              <div className="flex w-full">
                <div className="flex flex-row gap-9 text-center align-baseline">
                  <span className="text-lg font-bold text-white">Population:</span>
                  <RangeSlider
                    value={population}
                    onChange={setPopulation}
                    marks={populationMarks}
                    step={10}
                    min={0}
                    max={100}
                  />
                  <span className="text-lg font-bold text-white">{population} M</span>
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-4 '>
                                <div className="flex w-full h-40">
                                    <DataCard
                                        title="Water Inflow"
                                        value={"N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                                <div className="flex w-full h-40">
                                    <DataCard
                                        title="Water Outflow"
                                        value={"N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                                <div className="flex w-full h-40">
                                    <DataCard
                                        title="Water storage"
                                        value={"N/A"}
                                        unit="galH2O"
                                    />
                                </div>
                            </div>
          </div>

          {/* Right section: GaugeChart */}
          <div className="flex flex-col flex-1 px-5 w-full ">
            <Scenarioscore />
          </div>
          
        </section>

        <section className="flex flex-row w-full mt-20">
          {/* Left section: LucGraph */}
          <div className="flex flex-col flex-1 px-4">
            <LucGraph />
          </div>

          {/* Right section: SideBar */}
          <div className="flex flex-col flex-1 px-4">
            <SideBar />
          </div>
        </section>
      </div>
    </main>

  );
};

export default MainContent;
