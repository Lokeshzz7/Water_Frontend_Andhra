import React, { createContext, useContext, useState } from "react";
const GlobalStateContext = createContext();
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
export const GlobalStateProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState([]); // Store the selected data for the graph
  const updateSelectedData = (data) => {
    setSelectedData(data); // Update the data based on user selection
  };
  return (
    <GlobalStateContext.Provider value={{ selectedData, updateSelectedData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
