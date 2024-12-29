import React from 'react';
import {BASE_URL} from '../Config.js'

const ScenarioCard = ({ title, value, unit, legend }) => {

    return (
        <div className="flex flex-col pt-2  mb-6 w-[300px] h-[90px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-3xl max-md:px-5 max-md:mt-3">
            <div className="flex flex-col w-full pl-5 pr-5 ">
                <div className="text-lg font-bold text-left">{title}</div>
                <div className="flex justify-between items-end ">
                    {/* Left Side: Water Usage Value and Unit */}
                    <div className="flex items-baseline pt-2 mt-2">
                        <div className="text-xl font-bold text-[#f19cbb]">{value}</div>
                        <div className="text-sm font-semibold text-[#f19cbb] ml-2"><sub>{unit}</sub></div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default ScenarioCard;
