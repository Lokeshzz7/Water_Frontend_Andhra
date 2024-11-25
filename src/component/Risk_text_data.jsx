import React, { useEffect, useState } from 'react';
import riskData from '../data/RiskInfo.json'; // Import the risk combinations JSON
import stateData from '../data/risk_assessment_fake_data.json'; // Import the state data JSON

const RiskAssessment = () => {
  const [riskInfo, setRiskInfo] = useState(null);
  const [riskLevel, setRiskLevel] = useState(""); // State for storing the risk level text
  const [riskLevelClass, setRiskLevelClass] = useState(""); // State for storing the risk level class
  const [stateName, setStateName] = useState("");
  const [year, setYear] = useState("");

  const analyzeData = () => {
    // Retrieve selected state index and year from localStorage
    const selectedStateIndex = parseInt(localStorage.getItem('selectedState'), 10);
    const selectedYear = parseInt(localStorage.getItem('selectedYear'), 10);

    setStateName(selectedStateIndex || "");
    setYear(selectedYear || "");

    // Find the corresponding state data for the selected index and year
    const stateInfo = stateData.find(item => item.index === selectedStateIndex && item.year === selectedYear);

    if (stateInfo) {
      // Destructure the data
      const { flood_level, drought_level, evaporation, risk_factor } = stateInfo;

      // Determine the highest factor and corresponding combination
      let combination = "";

      if (flood_level >= drought_level && flood_level >= evaporation) {
        combination = "Flood > Drought > Evaporation";
      } else if (flood_level >= evaporation && flood_level >= drought_level) {
        combination = "Flood > Evaporation > Drought";
      } else if (drought_level >= flood_level && drought_level >= evaporation) {
        combination = "Drought > Flood > Evaporation";
      } else if (drought_level >= evaporation && drought_level >= flood_level) {
        combination = "Drought > Evaporation > Flood";
      } else if (evaporation >= flood_level && evaporation >= drought_level) {
        combination = "Evaporation > Flood > Drought";
      } else if (evaporation >= drought_level && evaporation >= flood_level) {
        combination = "Evaporation > Drought > Flood";
      }

      // Find the corresponding risk data based on the combination
      const riskCombinationData = riskData.find(item => item.combination === combination);

      // Replace placeholders with actual values dynamically
      if (riskCombinationData) {
        const updatedRiskInfo = {
          ...riskCombinationData,
          risk: riskCombinationData.risk
            .replace(/flood level of (\d+)/g, `flood level of ${flood_level}`)
            .replace(/drought level of (\d+)/g, `drought level of ${drought_level}`)
            .replace(/evaporation rate of (\d+)/g, `evaporation rate of ${evaporation}`),
          cause: riskCombinationData.cause
            .replace(/flood level of (\d+)/g, `flood level of ${flood_level}`)
            .replace(/drought level of (\d+)/g, `drought level of ${drought_level}`)
            .replace(/evaporation rate of (\d+)/g, `evaporation rate of ${evaporation}`),
          mitigation: riskCombinationData.mitigation // No change in mitigation
        };

        // Set the risk information
        setRiskInfo(updatedRiskInfo);

        // Determine the risk level based on the risk_factor
        if (risk_factor <= 33) {
          setRiskLevel("Low");
          setRiskLevelClass("text-green-400");
        } else if (risk_factor <= 66) {
          setRiskLevel("Medium");
          setRiskLevelClass("text-yellow-400");
        } else {
          setRiskLevel("High");
          setRiskLevelClass("text-red-400");
        }
      }
    }
  };

  useEffect(() => {
    analyzeData(); // Initial load

    const handleStorageChange = () => {
      analyzeData(); // Re-fetch data when localStorage values change
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [stateName, year]); // Dependencies are stateName and year, so it will re-run when they change

  return (
    <section className="flex flex-col items-start pt-7 pr-20 pb-36 pl-8 w-full shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-darkslateblue h-full rounded-lg ml-6 mt-8 mr-4 shadow-[0px_8px_26px_rgba(0,122,255,0.46),-8px_0px_26px_rgba(0,122,255,0.46)]  text-white max-md:px-5 max-md:pb-24 max-md:mt-9 max-md:max-w-full">
      <h2 className="text-6xl font-bold max-md:text-4xl text-center text-white">Risk Assessment</h2>

      <div className="mt-2 text-lg max-md:max-w-full text-white">
        <div className="mt-6 text-white">
          <p className="text-4xl font-bold p-6">
            Risk level: <span className={`font-semibold ${riskLevelClass}`}>{riskLevel}</span>
          </p>
        </div>
        {riskInfo ? (
          <>
            <div className=" pl-6">
              <p className="text-3xl font-bold text-blue-800">RISK :</p>
              <p className="text-xl font-bold text-white">{riskInfo.risk}</p>
              <p className="text-3xl mt-3 font-bold text-blue-800">Cause :</p>
              <p className=" text-xl font-bold text-white">{riskInfo.cause}</p>
              <div className="mt-4">
                <p className="text-3xl mt-3 font-bold text-blue-700">Mitigation:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2 font-bold black">
                  {riskInfo.mitigation.map((mitigation, index) => (
                    <li key={index} className="text-xl">{mitigation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xl text-white">Loading risk assessment data...</p>
        )}
      </div>
    </section>
  );
};

export default RiskAssessment;
