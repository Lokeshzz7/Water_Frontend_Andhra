import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataCard = ({ title, value }) => {

  return (
    <div className="flex flex-col  pt-2 mt-8  w-8/12 h-[100px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25),_-4px_-4px_4px_rgba(0,_0,_0,_0.25)] bg-component rounded-3xl max-md:px-5 max-md:mt-3">
      <div className="flex flex-col w-18/12 pl-3 pr-5 ">
        <div className="text-lg font-bold text-left">{title}</div>
        <div className="flex justify-between items-end ">
          {/* Left Side: Water Usage Value and Unit */}
          <div className="flex items-baseline pt-2 ">
            <div className="text-xl font-bold text-blue-500">{value}</div>
            <div className="text-sm font-semibold text-gray-500 ml-2"><sub></sub></div>
          </div>

          {/* Right Side: Legend */}
          {/* <div className="flex flex-col space-y-2 items-end pr-5">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#4CAF50] rounded mr-2"></div>
              <span className="text-lg text-gray-700">Domestic</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#f44336] rounded mr-2"></div>
              <span className="text-lg text-gray-700">Industrial</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#00BCD4] rounded mr-2"></div>
              <span className="text-lg text-gray-700">Irrigation</span>
            </div>
          </div> */}
        </div>
      </div>

    </div>
  );
};

export default DataCard;
