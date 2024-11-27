import React, { useState } from 'react';

const WaterUsageDashboard = () => {
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [reservoir, setReservoir] = useState('');

    const waterUsageData = [
        { month: 'Sep', value: 35.25, onTrack: true },
        { month: 'Oct', value: 35.25, onTrack: true },
        { month: 'Nov', value: 35.25, onTrack: true },
        { month: 'Dec', value: 35.25, onTrack: true },
        { month: 'Jan', value: 35.25, onTrack: true },
        { month: 'Feb', value: 35.25, onTrack: true },
    ];

    const waterUsageSummary = {
        totalWaterUse: 35.25,
        waterLimit: 40,
        sectorBreakdown: {
            agriculture: 25,
            domestic: 8,
            others: 67,
        },
    };

    return (
        <div className="water-usage-dashboard bg-gray-100 font-sans">
            <header className="header bg-gray-800 text-white py-4">
                <nav className="header-nav">
                    <ul className="flex space-x-6">
                        <li><a href="#" className="hover:text-gray-400">Welcome!</a></li>
                        <li><a href="#" className="hover:text-gray-400">Home</a></li>
                        <li><a href="#" className="hover:text-gray-400">Water Forecast</a></li>
                        <li><a href="#" className="hover:text-gray-400">Reservoir Status</a></li>
                        <li><a href="#" className="hover:text-gray-400">Risk Assessment</a></li>
                        <li><a href="#" className="hover:text-gray-400">Scenario Planning</a></li>
                        <li><a href="#" className="hover:text-gray-400">Reports & Exports</a></li>
                    </ul>
                </nav>
            </header>

            <div className="selectors mt-8 flex justify-between">
                <div className="selector w-1/4">
                    <label htmlFor="state" className="block font-bold mb-2">State</label>
                    <select id="state" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400">
                        <option value="">Select a state</option>
                        {/* Populate state options */}
                    </select>
                </div>
                <div className="selector w-1/4">
                    <label htmlFor="city" className="block font-bold mb-2">City</label>
                    <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400">
                        <option value="">Select a city</option>
                        {/* Populate city options */}
                    </select>
                </div>
                <div className="selector w-1/4">
                    <label htmlFor="district" className="block font-bold mb-2">District</label>
                    <select id="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400">
                        <option value="">Select a district</option>
                        {/* Populate district options */}
                    </select>
                </div>
                <div className="selector w-1/4">
                    <label htmlFor="reservoir" className="block font-bold mb-2">Reservoir</label>
                    <select id="reservoir" value={reservoir} onChange={(e) => setReservoir(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400">
                        <option value="">Select a reservoir</option>
                        {/* Populate reservoir options */}
                    </select>
                </div>
            </div>

            <div className="water-usage-summary mt-8 grid grid-cols-3 gap-4">
                <div className="summary-item bg-white shadow-md p-6">
                    <h3 className="text-lg font-bold mb-2">Total Water Use</h3>
                    <p className="text-2xl font-bold">{waterUsageSummary.totalWaterUse} gal/d</p>
                </div>
                <div className="summary-item bg-white shadow-md p-6">
                    <h3 className="text-lg font-bold mb-2">Water Limit</h3>
                    <p className="text-2xl font-bold">{waterUsageSummary.waterLimit} gal/d</p>
                </div>
                <div className="summary-item bg-white shadow-md p-6">
                    <h3 className="text-lg font-bold mb-2">Sector Breakdown</h3>
                    <ul className="list-disc pl-5">
                        <li>Agriculture: {waterUsageSummary.sectorBreakdown.agriculture}%</li>
                        <li>Domestic: {waterUsageSummary.sectorBreakdown.domestic}%</li>
                        <li>Others: {waterUsageSummary.sectorBreakdown.others}%</li>
                    </ul>
                </div>
            </div>

            <div className="water-usage-trend mt-8 bg-white shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Water Usage Trend</h3>
                <div className="chart-container h-48 flex justify-between">
                    {waterUsageData.map((data, index) => (
                        <div
                            key={index}
                            className={`chart-bar w-1/6 flex flex-col justify-end items-center ${data.onTrack ? 'bg-green-500' : 'bg-gray-400'}`}
                            style={{ height: `${(data.value / 40) * 100}%` }}
                        >
                            <span className="chart-label text-sm">{data.month}</span>
                            <span className="chart-value text-base font-bold">{data.value} gal/d</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WaterUsageDashboard;