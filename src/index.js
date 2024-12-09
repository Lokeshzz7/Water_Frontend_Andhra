import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GlobalStateProvider } from "./context/GlobalStateContext"; // Import the GlobalStateProvider
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Header from "./component/Header.jsx";
import RiskAssessment from "./RiskAssessmentMain.jsx";
import ScenarioPlanning from "./ScenarioPlanning.jsx";
import ReportsExports from "./ReportsExports.jsx";
import ReservoirStatus from "./ReservoirStatus.jsx";
import WaterForecast from "./WaterForecast.jsx";
import Map from "./map.jsx";
import Home from "./Home.jsx";
import SideBar from "./component/SideBar.jsx";
import { Navigate } from "react-router-dom";
import ImportsMain from "./ImportsMain.jsx";


async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

// The root element where the app will be rendered
const rootElement = document.getElementById("root");

// Wrap the rendering process inside enableMocking() and start the app after mocking is enabled
enableMocking().then(() => {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <GlobalStateProvider>
        {/* Wrap the Router with GlobalStateProvider to provide global state */}
        <Router>
          <Header />
          <div className="w-full flex flex-row items-start justify-start gap-[32px]  mq1000:pl-5 mq1000:pr-5 mq1000:box-border mq725:gap-[16px]">
            <SideBar />
            <Routes>
              <Route path="/" element={<Navigate to="/waterforecast" />} />
              <Route path="/waterforecast" element={<WaterForecast />} />
              <Route path="/reservoirstatus" element={<ReservoirStatus />} />
              <Route path="/riskassessment" element={<RiskAssessment />} />
              <Route path="/scenarioplanning" element={<ScenarioPlanning />} />
              <Route path="/reports" element={<ReportsExports />} />
              <Route path="/imports" element={<ImportsMain/>} />
              <Route path="/map" element={<Map />} />
            </Routes>
          </div>
        </Router>
      </GlobalStateProvider>
    </React.StrictMode>
  );

  // Optionally, report web vitals if needed
  reportWebVitals();
});
