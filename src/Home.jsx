import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './component/Header.jsx';
import RiskAssessment from './RiskAssessmentMain.jsx';
import ScenarioPlanning from './ScenarioPlanning.jsx';
import ReportsExports from './ReportsExports.jsx';
import ReservoirStatus from './ReservoirStatus.jsx';
import WaterForecast from './WaterForecast.jsx';
import Map from './map.jsx';
import Selection_Dropdown from './component/Selection_Dropdown';
import './ButtonStyles.css';
import FilterDropdown from './component/FilterDropdown.jsx';

const Home = () => {
    const [items, setItems] = useState([]);
    const [activeComponent, setActiveComponent] = useState('WaterForecast'); // default to show WaterForecast initially


    const renderComponent = () => {
        switch (activeComponent) {
            case 'WaterForecast':
                return <WaterForecast />;
            case 'ReservoirStatus':
                return <ReservoirStatus />;
            case 'RiskAssessment':
                return <RiskAssessment />;
            case 'ScenarioPlanning':
                return <ScenarioPlanning />;
            
            default:
                return null;
        }
    };

    return (
        <div>
            <div className='mt-9'>
                <FilterDropdown />
            </div>
            <div className='flex justify-around mb-8 mt-8'>
                <button className="c-button c-button--gooey" onClick={() => setActiveComponent('WaterForecast')}>
                    Water
                    <span className="c-button__blobs">
                        <div></div>
                        <div></div>
                        <div></div>
                    </span>
                </button>
                <button className="c-button c-button--gooey" onClick={() => setActiveComponent('ReservoirStatus')}>
                    Reservoir
                    <span className="c-button__blobs">
                        <div></div>
                        <div></div>
                        <div></div>
                    </span>
                </button>
                <button className="c-button c-button--gooey" onClick={() => setActiveComponent('ScenarioPlanning')}>
                    Scenario
                    <span className="c-button__blobs">
                        <div></div>
                        <div></div>
                        <div></div>
                    </span>
                </button>
                <button className="c-button c-button--gooey" onClick={() => setActiveComponent('RiskAssessment')}>
                    Risk
                    <span className="c-button__blobs">
                        <div></div>
                        <div></div>
                        <div></div>
                    </span>
                </button>
                
            </div>

            {/* Render the selected component */}
            {renderComponent()}
        </div>
    );
};

export default Home;
