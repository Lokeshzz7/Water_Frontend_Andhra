import React from 'react';

const ScenarioDataCard = ({ title, value, details }) => {
    return (
        <div className="flex flex-col pl-2 w-full bg-component  rounded-2xl border border-gray-100 transform transition-all duration-300 shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] ">
            {/* Title Section */}
            <div className="  border-b border-gray-200">
                <h3 className="text-lg font-bold text-white tracking-wider">{title}</h3>
            </div>

            {/* Value Section */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline">
                    <span className="text-lg font-extrabold text-[#f19cbb] mr-2">{value}</span>
                </div>
            </div>

            {/* Details Section
            {details && (
                <div className="grid grid-cols-2 gap-8 mt-9">
                    {Object.entries(details).map(([key, val], index) => (
                        <div
                            key={key}
                            className={`flex   bg-component p-4 rounded-xl shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] ${index === Object.entries(details).length - 1 ? 'col-span-2' : ''}`}
                        >
                            <div className="flex-grow">
                                <div className="text-xl font-semibold text-white capitalize mb-1">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                </div>
                                <div className="text-sm font-medium text-[#f19cbb]">{val}</div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default ScenarioDataCard;
