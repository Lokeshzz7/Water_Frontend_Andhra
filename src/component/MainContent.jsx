import React, { useState } from 'react';
import RangeSlider from '../graph/Slider';
import Scenarioscore from '../graph/Scenarioscore';
import DataCard from './DataCard';

const MainContent = () => {
  // State for the sliders
  const [rainfall, setRainfall] = useState(50);
  const [evaporation, setEvaporation] = useState(25);
  const [population, setPopulation] = useState(100);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Slider marks
  const rainfallMarks = [
    { value: 0, label: '0 mm' },
    { value: 50, label: '50 mm' },
    { value: 100, label: '100 mm' },
  ];

  const evaporationMarks = [
    { value: 0, label: '0 mm' },
    { value: 20, label: '20 mm' },
    { value: 40, label: '40 mm' },
  ];

  const populationMarks = [
    { value: 0, label: '0 M' },
    { value: 50, label: '50 M' },
    { value: 100, label: '100 M' },
  ];

  const handleApply = async () => {
    setLoading(true);
    setResponseMessage('');

    try {
      // Retrieve the district_id from local storage
      const districtId = localStorage.getItem('selectedDistrict');

      if (!districtId) {
        setResponseMessage('District ID is not available. Please select a district.');
        setLoading(false);
        return;
      }

      // Constructing the API URL with query parameters
      const apiUrl = `http://127.0.0.1:8000/api/scenario/get-simulation/?evaporation=${evaporation}&rainfall=${rainfall}&population=${population}&district_id=${districtId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || 'Data processed successfully!');
      } else {
        setResponseMessage('Failed to process data.');
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      setResponseMessage('An error occurred while processing the data.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="flex overflow-hidden flex-col justify-evenly items-center px-5 py-9 max-md:px-5 w-[1700px]">
      <div className="flex flex-col justify-center items-center p-3 w-full">
        <section className="flex flex-row w-full">
          {/* Left section: Group of sliders */}
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col justify-between gap-4 px-4 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component ml-5 mt-7 p-8 pl-10 ">
              {/* Group of three sliders: Rainfall, Evaporation, and Population */}
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
                  <span className="text-lg font-bold text-white">Evaporation:</span>
                  <RangeSlider
                    value={evaporation}
                    onChange={setEvaporation}
                    marks={evaporationMarks}
                    step={5}
                    min={0}
                    max={40}
                  />
                  <span className="text-lg font-bold text-white">{evaporation} mm</span>
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
              {/* Apply Button */}
              <div className="flex justify-center mt-5">
                <button
                  onClick={handleApply}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {responseMessage && (
                <p className="mt-3 text-white text-center">{responseMessage}</p>
              )}
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
                  title="Water Storage"
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
      </div>
    </main>
  );
};

export default MainContent;