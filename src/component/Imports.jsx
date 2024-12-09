import React from 'react';
import UploadButton from './UploadButton';

const Imports = () => {
    // Function to generate PDF (you'll need to implement the actual PDF generation logic)
    const generatePDF = () => {
        alert('PDF Generation Functionality to be implemented');
    };

    // Function to simulate generating an API endpoint
    

    return (
        <div className="container mx-auto py-5">
            {/* Main Header Section */}
            <header className="text-white p-6 w-[1350px] ml-6 mt-3 mr-6 rounded-lg shadow-md bg-component">
                <h1 className="text-2xl font-bold">Imports - Water Management Dashboard</h1>
                <section className="p-2 bg-gray-100 rounded-lg ">
                    <h2 className="text-xl font-semibold mb-3">Data Upload Requirements</h2>
                    <p className="text-md mb-2">To ensure proper data integration and analysis, please make sure that the uploaded file meets the following requirements:</p>
                    <ul className="list-disc ml-6">
                        <li><strong>File Format:</strong> CSV file format only.</li>
                        <li><strong>Required Columns:</strong> The CSV should contain the following columns:</li>
                        <ul className="list-inside">
                            <li>State</li>
                            <li>District</li>
                            <li>Year</li>
                            <li>Month</li>
                            <li>Reservoir Name</li>
                            <li>Reservoir Capacity (MCM/TMC)</li>
                            <li>Storage (MCM/TMC)</li>
                            <li>Capacity (MCM/TMC)</li>
                            <li>Flood Cushion (MCM/TMC)</li>
                            <li>Inflow (MCM/TMC)</li>
                            <li>Outflow (MCM/TMC)</li>
                            <li>Purpose of Reservoir (e.g., Irrigation, Drinking, Hydropower)</li>
                            <li>Monthly Water Consumption (MCM/TMC)</li>
                            <li>Land Use Categories (e.g., Built-up, Agriculture, Forest, Wasteland, Wetlands, Waterbodies)</li>
                            <li>Normal Rainfall (mm)</li>
                            <li>Actual Rainfall (mm)</li>
                        </ul>
                    </ul>
                    <p className="text-sm mt-3">Please ensure that the data is consistent and up-to-date to facilitate accurate analysis and forecasting.</p>
                </section>
                <UploadButton />
            </header>

            
        </div>
    );
};

export default Imports;