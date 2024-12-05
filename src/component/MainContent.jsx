import React, { useState, useEffect } from 'react';
import RangeSlider from '../graph/Slider';
import Scenarioscore from '../graph/Scenarioscore';
import ScenarioCard from './ScenarioCard';
import jsonData from '../data/rain_evap_pop.json'; // Adjust the path to your JSON file
import DroughtScore from '../graph/DroughtScore';
import FloodScore from '../graph/FloodScore';

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
  const [rainfallMarks, setRainfallMarks] = useState([]);
  const [evaporationMarks, setEvaporationMarks] = useState([]);
  const [populationMarks, setPopulationMarks] = useState([]);
  const [responseData, setResponseData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');

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

      const minRainfall = Math.min(...rainfallValues) - 50;
      const maxRainfall = Math.max(...rainfallValues) + 50;

      const minEvaporation = Math.min(...evaporationValues) - 50;
      const maxEvaporation = Math.max(...evaporationValues) + 50;

      const minPopulation = Math.min(...populationValues) - 10000;
      const maxPopulation = Math.max(...populationValues) + 10000;

      setRainfallMarks([
        { value: minRainfall, label: `${minRainfall.toFixed(2)} mm` },
        { value: avgRainfall, label: `${avgRainfall} mm` },
        { value: maxRainfall, label: `${maxRainfall.toFixed(2)} mm` },
      ]);

      setEvaporationMarks([
        { value: minEvaporation, label: `${minEvaporation.toFixed(2)} mm` },
        { value: avgEvaporation, label: `${avgEvaporation} mm` },
        { value: maxEvaporation, label: `${maxEvaporation.toFixed(2)} mm` },
      ]);

      setPopulationMarks([
        { value: minPopulation, label: `${minPopulation} M` },
        { value: avgPopulation, label: `${avgPopulation} M` },
        { value: maxPopulation, label: `${maxPopulation} M` },
      ]);

      setRainfall(Number(avgRainfall));
      setEvaporation(Number(avgEvaporation));
      setPopulation(Number(avgPopulation));
    };

    initializeSliders();
  }, [selectedDistrict]);


  const handleApply = async () => {
    try {
      if (!selectedDistrict) {
        setResponseMessage('District ID is not available. Please select a district.');
        return;
      }

      const apiUrl = `http://127.0.0.1:8000/api/scenario/get-simulation/?evaporation=${evaporation}&rainfall=${rainfall}&population=${population}&district_id=${selectedDistrict}`;
      const response = await fetch(apiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      if (response.ok) {
        const data = await response.json();
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
          <div className="flex flex-col gap-4 px-2 shadow bg-component ml-5  p-8 pl-10 w-[650px] h-[330px]">
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-11">Rainfall:</span>
              <RangeSlider
                value={rainfall}
                onChange={setRainfall}
                marks={rainfallMarks}
                step={10}
                min={rainfallMarks[0]?.value || 0}
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
                min={evaporationMarks[0]?.value || 0}
                max={evaporationMarks[2]?.value || 40}
              />
            </div>
            <div className="flex w-full">
              <span className="text-lg font-bold text-white mr-6">Population:</span>
              <RangeSlider
                value={population}
                onChange={setPopulation}
                marks={populationMarks}
                step={1000}
                min={populationMarks[0]?.value || 0}
                max={populationMarks[2]?.value || 1000000}
              />
            </div>
            <button onClick={handleApply} className="bg-blue-500 text-white">Apply</button>
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        </div>

        <div className="flex flex-col flex-1 px-4">
          <FloodScore FloodScore={responseData["Drought Score"] ?? 0} />
        </div>

      </section>

      <section className="flex flex-row w-full mt-8" >
        <div className="flex flex-col w-full">
          {responseData && (
            <>
              <div className="flex flex-row justify-between px-4 ">
                <div className="flex flex-col">   
                  <ScenarioCard title="SPEI" value={responseData.SPEI ?? 'N/A'} unit="" />
                  <ScenarioCard title="Drought Risk" value={responseData["Drought Risk"] ?? 'N/A'} unit="" />
                  <ScenarioCard
                    title="Adjusted Inflow"
                    value={responseData["Adjusted Inflow"] !== undefined && responseData["Adjusted Inflow"] !== null
                      ? responseData["Adjusted Inflow"].toFixed(2)
                      : 'N/A'}
                    unit="Mm³"
                  />
                </div>
                <div className="flex flex-col">
                  <ScenarioCard title="Flood Risk" value={responseData["Flood Risk"] ?? 'N/A'} unit="" />
                  <ScenarioCard
                    title="Adjusted Outflow"
                    value={responseData["Adjusted Outflow"] !== undefined && responseData["Adjusted Outflow"] !== null
                      ? responseData["Adjusted Outflow"].toFixed(2)
                      : 'N/A'}
                    unit="Mm³"
                  />
                  <ScenarioCard
                    title="Storage Change"
                    value={responseData["Storage Change"] !== undefined && responseData["Storage Change"] !== null
                      ? responseData["Storage Change"].toFixed(2)
                      : 'N/A'}
                    unit="Mm³"
                  />
                </div>
                {/* <ScenarioCard
                  title="Drought Score"
                  value={responseData["Drought Score"] !== undefined && responseData["Drought Score"] !== null
                    ? responseData["Drought Score"].toFixed(2)
                    : 'N/A'}
                  unit=""
                />
                <ScenarioCard
                  title="Flood Score"
                  value={responseData["Flood Score"] !== undefined && responseData["Flood Score"] !== null
                    ? responseData["Flood Score"].toFixed(2)
                    : 'N/A'}
                  unit=""
                /> */}

              </div>
            </>
          )}
        </div>

        <div className="flex flex-col flex-1 px-4">
          <DroughtScore droughtScore={responseData["Drought Score"] ?? 0} />
        </div>

      </section>
    </main>
  );
};

export default MainContent;
