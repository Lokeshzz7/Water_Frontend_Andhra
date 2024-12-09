import React from 'react'

const Exports = () => {
    const generateAPI = () => {
        alert('API Endpoint: https://example.com/api/data');
    };

    // Function to simulate CSV download
    const downloadCSV = () => {
        alert('CSV file downloaded. (Simulated for now)');
    };
    return (
        <div className="container mx-auto pb-6 bg-darkslateblue">
            <section className="p-6 mt-2 ml-6 mr-6  rounded-lg shadow-md bg-component">
                <h2 className="text-xl font-semibold mb-3">Exports - Data Download and API</h2>
                <p className="text-md mb-4">You can export the data in the following formats:</p>

                {/* CSV Download Button */}
                <div className="mb-4">
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                        Download CSV
                    </button>
                </div>

                {/* API Generation Button */}
                <div>
                    <button
                        onClick={generateAPI}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                    >
                        Generate API
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Exports
