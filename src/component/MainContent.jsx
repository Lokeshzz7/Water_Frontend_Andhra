import React, { useState, useEffect } from 'react';
import RangeSlider from '../graph/Slider';
import Scenarioscore from '../graph/Scenarioscore';
import ScenarioCard from './ScenarioCard';
import jsonData from '../data/rain_evap_pop.json'; // Adjust the path to your JSON file
import DroughtScore from '../graph/DroughtScore';
import FloodScore from '../graph/FloodScore';
import {BASE_URL} from '../Config.js'

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [value, setValue];
};

const MainContent = () => {
  const [selectedDistrict, setSelectedDistrict] = useLocalStorage('selectedDistrict', null);
  const [rainfall, setRainfall] = useState(50);
  const [evaporation, setEvaporation] = useState(25);
  const [population, setPopulation] = useState(100);
  const [inflow, setInflow] = useState(5000);
  const [outflow, setOutflow] = useState(5000);
  const [rainfallMarks, setRainfallMarks] = useState([]);
  const [evaporationMarks, setEvaporationMarks] = useState([]);
  const [populationMarks, setPopulationMarks] = useState([]);
  const [responseData, setResponseData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [InflowMarks, setInflowMarks] = useState([]);
  const [OutFlowMarks, setOutFlowMarks] = useState([]);

  useEffect(() => {
    const initializeSliders = () => {
      if (!selectedDistrict || !jsonData[selectedDistrict]) {
        console.error('District data not found.');
        return;
      }

      const districtData = jsonData[selectedDistrict];
      const rainfallValues = districtData.map(item => item['Normal Rainfall']).filter(val => val !== undefined);
      const evaporationValues = districtData.map(item => item['Total Evaporation']).filter(val => val !== undefined);
      const populationValues = districtData.map(item => item['Population']).filter(val => val !== undefined);

      if (!rainfallValues.length || !evaporationValues.length || !populationValues.length) {
        console.error('Incomplete data for the selected district.');
        return;
      }

      const avgRainfall = (rainfallValues.reduce((a, b) => a + b, 0) / rainfallValues.length).toFixed(2);
      const avgEvaporation = (evaporationValues.reduce((a, b) => a + b, 0) / evaporationValues.length).toFixed(2);
      const avgPopulation = (populationValues.reduce((a, b) => a + b, 0) / populationValues.length).toFixed(0);

      const maxRainfall = Math.max(...rainfallValues) + 50;
      const maxEvaporation = Math.max(...evaporationValues) + 50;
      const minPopulation = Math.min(...populationValues) - 10000;
      const maxPopulation = Math.max(...populationValues) + 10000;

      setRainfallMarks([
        { value: 0, label: '0 mm' },
        { value: avgRainfall, label: `${avgRainfall} mm` },
        { value: maxRainfall, label: `${maxRainfall.toFixed(2)} mm` },
      ]);

      setEvaporationMarks([
        { value: 0, label: '0 mm' },
        { value: avgEvaporation, label: `${avgEvaporation} mm` },
        { value: maxEvaporation, label: `${maxEvaporation.toFixed(2)} mm` },
      ]);

      setPopulationMarks([
        { value: minPopulation, label: `${minPopulation} Cusecs` },
        { value: avgPopulation, label: `${avgPopulation} Cucecs` },
        { value: maxPopulation, label: `${maxPopulation} Cucecs` },
      ]);
      setInflowMarks([
        { value: 0, label: '0 TMC' },
        { value: 50, label: `${50} TMC` },
        { value: 100, label: `${100} TMC` },

      ])
      setOutFlowMarks([
        { value: 0, label: '0 TMC' },
        { value: 50, label: `${50} TMC` },
        { value: 100, label: `${100} TMC` },

      ])

      setRainfall(Number(avgRainfall));
      setEvaporation(Number(avgEvaporation));
      setPopulation(Number(avgPopulation));
      setInflow(5000);
      setOutflow(5000);

    };

    initializeSliders();
  }, [selectedDistrict]);

  const handleApply = async () => {
    try {
      if (!selectedDistrict) {
        setResponseMessage('District ID is not available. Please select a district.');
        return;
      }

      const apiUrl = `${BASE_URL}/api/scenario/get-simulation/?evaporation=${evaporation}&rainfall=${rainfall}&population=${1e6}&inflow=${(inflow*100)}&outflow=${(outflow*100)}&district_id=${selectedDistrict}`;
      const response = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      if (response.ok) {
        const data = await response.json();
        console.log("Score : " , data);
        setResponseData(data);
        setResponseMessage('Data retrieved successfully!');
      } else {
        setResponseMessage('Failed to retrieve data.');
      }
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      setResponseMessage('An error occurred while fetching data.');
    }
  };

  return (
    <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5">
      <section className="flex flex-row w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4 shadow bg-component ml-9 p-8 pl-8 w-[650px] h-[370px]">
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-11">Rainfall:</span>
              <RangeSlider
                value={rainfall}
                onChange={setRainfall}
                marks={rainfallMarks}
                step={10}
                min={0}
                max={rainfallMarks[2]?.value || 100}
              />
            </div>
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-4">Evaporation:</span>
              <RangeSlider
                value={evaporation}
                onChange={setEvaporation}
                marks={evaporationMarks}
                step={5}
                min={0}
                max={evaporationMarks[2]?.value || 40}
              />
            </div>
            {/* <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-6">Population:</span>
              <RangeSlider
                value={population}
                onChange={setPopulation}
                marks={populationMarks}
                step={1000}
                min={populationMarks[0]?.value || 0}
                max={populationMarks[2]?.value || 1000000}
              />
            </div> */}
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-6">Inflow:</span>
              <RangeSlider
                value={inflow}
                onChange={setInflow}
                marks={InflowMarks}
                step={5}
                min={0}
                max={100}
              />
            </div>
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-6">Outflow:</span>
              <RangeSlider
                value={outflow}
                onChange={setOutflow}
                marks={OutFlowMarks}
                step={5}
                min={0}
                max={100}
              />
            </div>
            <button onClick={handleApply} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Apply</button>
            {responseMessage && <p></p>}
          </div>
        </div>
        <div className="flex flex-col w-full">
          {responseData && (
            <>
              <div className="flex flex-row justify-between px-4 ">
                <div className="flex flex-col">
                  {/* <ScenarioCard title="SPEI" value={responseData.SPEI ?? 'N/A'} unit="" /> */}
                  <ScenarioCard title="Drought Risk" value={responseData["Drought Risk"] ?? 'N/A'} unit="" />
                  <ScenarioCard
                    title="Adjusted Inflow"
                    value={responseData["Adjusted Inflow"] !== undefined && responseData["Adjusted Inflow"] !== null
                      ? responseData["Adjusted Inflow"].toFixed(2)
                      : 'N/A'}
                    unit="TMC"
                  />
                  <ScenarioCard
                    title="Storage Change"
                    value={responseData["Storage Change"] !== undefined && responseData["Storage Change"] !== null
                      ? (responseData["Storage Change"]/100).toFixed(2)
                      : 'N/A'}
                    unit="TMC"
                  />
                </div>
                <div className="flex flex-col">
                  <ScenarioCard title="Flood Risk" value={responseData["Flood Risk"] ?? 'N/A'} unit="" />
                  <ScenarioCard
                    title="Adjusted Outflow"
                    value={responseData["Adjusted Outflow"] !== undefined && responseData["Adjusted Outflow"] !== null
                      ? responseData["Adjusted Outflow"].toFixed(2)
                      : 'N/A'}
                    unit="TMC"
                  />
                  {/* <ScenarioCard
                    title="Storage Change"
                    value={responseData["Storage Change"] !== undefined && responseData["Storage Change"] !== null
                      ? responseData["Storage Change"].toFixed(2)
                      : 'N/A'}
                    unit="Mm³"
                  /> */}
                </div>
              </div>
            </>
          )}
        </div>


      </section>

      <section className="flex flex-row w-full mt-8" >

        <div className="flex flex-col flex-1 px-4">
          <FloodScore FloodScore={responseData["Flood Score"] ?? 0} />
          {/* Add other components as necessary */}
        </div>
        <div className="flex flex-col flex-1 px-4">
          <DroughtScore droughtScore={responseData["Drought Score"] ?? 0} />
        </div>

      </section>
    </main>
  );
};

export default MainContent;
