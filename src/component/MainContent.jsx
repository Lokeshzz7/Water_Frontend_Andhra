import React, { useState, useEffect } from 'react';
import RangeSlider from '../graph/Slider';
import Scenarioscore from '../graph/Scenarioscore';
import DataCard from './DataCard';
import jsonData from '../data/rain_evap_pop.json'; // Adjust the path to your JSON file

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
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const initializeSliders = () => {
      if (!selectedDistrict || !jsonData[selectedDistrict]) {
        console.error('District data not found.');
        return;
      }

      const districtData = jsonData[selectedDistrict];
      const rainfallValues = districtData.map(item => item['Normal Rainfall']);
      const evaporationValues = districtData.map(item => item['Total Evaporation']);
      const populationValues = districtData.map(item => item['Population']);

      // Calculate averages, min, and max
      const avgRainfall = (rainfallValues.reduce((a, b) => a + b, 0) / rainfallValues.length).toFixed(2);
      const avgEvaporation = (evaporationValues.reduce((a, b) => a + b, 0) / evaporationValues.length).toFixed(2);
      const avgPopulation = (populationValues.reduce((a, b) => a + b, 0) / populationValues.length).toFixed(0);

      const minRainfall = Math.min(...rainfallValues) - 50;
      const maxRainfall = Math.max(...rainfallValues) + 50;

      const minEvaporation = Math.min(...evaporationValues) - 50;
      const maxEvaporation = Math.max(...evaporationValues) + 50;

      const minPopulation = Math.min(...populationValues) - 10000;
      const maxPopulation = Math.max(...populationValues) + 10000;

      // Update slider marks
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

      // Set initial slider values to averages
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
        setResponseMessage(data.message || 'Data processed successfully!');
      } else {
        setResponseMessage('Failed to process data.');
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      setResponseMessage('An error occurred while processing the data.');
    }
  };

  return (
    <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5 w-[1700px]">
      <div className="flex flex-col justify-center items-center p-3 w-full">
        <section className="flex flex-row w-full">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col gap-4 px-4 shadow bg-component ml-5 mt-7 p-8 pl-10">
              <div className="flex w-full">
                <span className="text-lg font-bold text-white">Rainfall:</span>
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
                <span className="text-lg font-bold text-white">Evaporation:</span>
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
                <span className="text-lg font-bold text-white">Population:</span>
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
          <div className="flex w-full">
            <Scenarioscore />
          </div>
        </section>
      </div>
    </main>
  );
};

export default MainContent;
