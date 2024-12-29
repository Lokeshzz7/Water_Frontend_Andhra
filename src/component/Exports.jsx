import React, { useState } from 'react';
import ExportsDrop from './ExportsDrop.jsx';
import {BASE_URL} from '../Config.js'

const Exports = () => {
    // State for loading
    const [isLoading, setIsLoading] = useState(false);

    // Retrieve values from localStorage
    const district = localStorage.getItem('selectedDistrict');
    const year = localStorage.getItem('selectedYear');
    const month = localStorage.getItem('selectedMonth');

    // Function to simulate API call and download CSV file
    const downloadCSV = async () => {
        if (!district || !year || !month) {
            alert('Please select district, year, and month.');
            return;
        }

        // Set loading state to true
        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/forecast/get-exports/${district}/${year}/${month}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch CSV data');
            }

            const blob = await response.blob();  // Get the CSV file as a Blob
            const url = window.URL.createObjectURL(blob);  // Create a URL for the Blob
            const link = document.createElement('a');  // Create a link element
            link.href = url;  // Set the URL as the link's href
            link.download = 'data.csv';  // Set the filename for the download
            link.click();  // Trigger the download
            window.URL.revokeObjectURL(url);  // Clean up the URL
        } catch (error) {
            alert('Error downloading CSV: ' + error.message);
        } finally {
            // Set loading state to false when the process is finished
            setIsLoading(false);
        }
    };

    return (
        <>
            <ExportsDrop />
            <div className="container mx-auto mt-4 pb-6 bg-darkslateblue">
                <section className="p-6 mt-2 ml-6 mr-6 rounded-lg shadow-md bg-component">
                    <h2 className="text-xl font-semibold mb-3">Exports - Data Download and API</h2>
                    <p className="text-md mb-4">You can export the data </p>

                    {/* Show processing message while loading */}
                    {isLoading && (
                        <div className="text-yellow-500 font-semibold mb-4">
                            Data is being processed, please wait...
                        </div>
                    )}

                    {/* CSV Download Button */}
                    <div className="mb-4">
                        <button
                            onClick={downloadCSV}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        >
                            Download CSV
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Exports;
