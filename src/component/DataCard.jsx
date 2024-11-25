import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataCard = ({ title, value, unit }) => {

  return (
    <div className="flex flex-col  py-9 mt-8  w-[300px] h-[215px] bg-white rounded-3xl shadow-[12px_13px_26px_rgba(0,122,255,0.46)] max-md:px-5 max-md:mt-3">
      <div className="flex flex-col w-[300px] mb-8 pl-8">
        <div className="text-lg font-bold text-left">{title}</div>
        <div className="flex justify-between items-end mt-3">
          {/* Left Side: Water Usage Value and Unit */}
          <div className="flex items-baseline">
            <div className="text-8xl font-bold text-blue-500">{value}</div>
            <div className="text-lg font-semibold text-gray-500 ml-2">galH<sub>2</sub>O</div>
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
