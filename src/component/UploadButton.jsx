import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse'; // For JSON to CSV
import * as XLSX from 'xlsx'; // For Excel to CSV

// Visually hidden input to trigger file selection via the button
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadButton() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [csvData, setCsvData] = useState('');

    // Handle file upload and conversion
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);  // Store the uploaded file
            await convertAndGenerateCSV(file); // Convert the file to CSV
        }
    };

    // Function to convert JSON or Excel file to CSV
    const convertAndGenerateCSV = async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        let csvData = '';

        // Convert JSON to CSV using PapaParse
        if (fileExtension === 'json') {
            const reader = new FileReader();
            reader.onload = () => {
                const jsonData = JSON.parse(reader.result);
                csvData = Papa.unparse(jsonData); // Convert JSON to CSV
                setCsvData(csvData); // Set the CSV data state
                generateCSVDownload(csvData); // Trigger CSV download
            };
            reader.readAsText(file);
        }
        // Convert Excel to CSV using xlsx
        else if (['xls', 'xlsx'].includes(fileExtension)) {
            const reader = new FileReader();
            reader.onload = () => {
                const data = reader.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                csvData = XLSX.utils.sheet_to_csv(worksheet); // Convert Excel to CSV
                setCsvData(csvData); // Set the CSV data state
                generateCSVDownload(csvData); // Trigger CSV download
            };
            reader.readAsBinaryString(file);
        } else {
            alert('Unsupported file format. Please upload a JSON or Excel file.');
        }
    };

    // Function to trigger CSV download
    const generateCSVDownload = (csvData) => {
        const blob = new Blob([csvData], { type: 'text/csv' }); // Create a Blob with the CSV data
        const url = window.URL.createObjectURL(blob); // Create an object URL for the Blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url; // Set the URL to the Blob URL
        a.download = 'converted-file.csv'; // Set the download filename
        a.click(); // Programmatically click the anchor to trigger the download
        window.URL.revokeObjectURL(url); // Revoke the Blob URL to clean up
    };

    return (
        <div>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
            >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                />
            </Button>

            {/* Display the uploaded file name */}
            {uploadedFile && (
                <div>
                    <p>Uploaded File: {uploadedFile.name}</p>
                </div>
            )}

            {/* Display a message when CSV conversion is ready */}
            {csvData && (
                <div>
                    <p>Converted CSV ready for download!</p>
                </div>
            )}
        </div>
    );
}
