import React, { useEffect, useState } from 'react';

const RiskAssessment = () => {
  const [riskInfo, setRiskInfo] = useState(null);
  const [riskLevel, setRiskLevel] = useState(""); // State for storing the risk level text
  const [riskLevelClass, setRiskLevelClass] = useState(""); // State for storing the risk level class
  const [stateName, setStateName] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state

  const analyzeData = async () => {
    try {
      // Retrieve selected data from localStorage
      const selectedDistrict = localStorage.getItem('selectedDistrict');
      const selectedMonth = localStorage.getItem('selectedMonth');

      setStateName(selectedDistrict || "");
      setYear(selectedMonth || "");

      // API call to get the risk data based on district, year, and month
      const response = await fetch(`http://127.0.0.1:8000/api/risk/get-risk/${selectedDistrict}/2024/${selectedMonth}`);
      const data = await response.json();
      console.log("api :", response);
      console.log("data ;", data);

      if (data.response && data.response.length > 0) {
        const riskData = data.response[0]; // Assuming there is only one response

        // Extract risk data
        const { risk_type, description, causes, mitigation, risk_score } = riskData;

        // Set the risk information
        setRiskInfo({
          risk: risk_type,
          description,
          cause: causes,
          mitigation: mitigation.split(", "), // Assuming mitigation is a comma-separated list
        });

        // Determine the risk level based on the risk_score
        if (risk_score <= 33) {
          setRiskLevel("Low");
          setRiskLevelClass("text-green-400");
        } else if (risk_score <= 66) {
          setRiskLevel("Medium");
          setRiskLevelClass("text-yellow-400");
        } else {
          setRiskLevel("High");
          setRiskLevelClass("text-red-400");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
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
    <section className="flex flex-col items-start p-2 w-full shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component h-full rounded-lg ml-6 mt-1 mr-4 text-white max-md:px-5 max-md:pb-24 max-md:mt-9 max-md:max-w-full">
      <h2 className="text-6xl ml-[240px] font-bold max-md:text-4xl text-center text-white">Risk Assessment</h2>

      <div className="text-lg max-md:max-w-full text-white">
        <div className="mt-2 text-white">
          <p className="text-[30px] m-0 font-bold ">
            Risk level: <span className={`font-semibold ${riskLevelClass}`}>{riskLevel}</span>
          </p>
        </div>
        {loading ? (
          <p className="text-center text-xl text-white">Loading risk assessment data...</p>
        ) : riskInfo ? (
          <>
            <div className="pl-6">
              <p className="text-xl font-bold text-blue-800">RISK :</p>
              <p className="text-lg font-bold text-white">{riskInfo.risk.replace(/^Risk:\s*/, '')}</p>
              <p className="text-xl mt-3 font-bold text-blue-800">Cause :</p>
              <p className="text-lg font-bold text-white">
                {riskInfo.cause
                  .slice(9) // Remove the first 9 characters (after "Causes: ")
                  .split(',') // Split the string by commas
                  .map((cause, index) => (
                    <span key={index} className="block mb-2">{cause.trim()}</span> // Add margin-bottom to each line
                  ))}
              </p>

              <div className="mt-4">
                <p className="text-xl mt-3 font-bold text-blue-700">Mitigation:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2 font-bold black">
                  {riskInfo.mitigation.map((mitigation, index) => (
                    <li key={index} className="text-lg">{mitigation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xl text-white">No risk assessment data found for this selection.</p>
        )}
      </div>
    </section>
  );
};

export default RiskAssessment;
