import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    const [uploadStatus, setUploadStatus] = useState('');

    // Handle file upload and send a POST request
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            await sendFileToAPI(file);
        }
    };

    // Function to send the CSV file to the API via POST request
    const sendFileToAPI = async (file) => {
        const formData = new FormData();
        formData.append('file', file); // Append the file to the FormData object

        try {
            const response = await fetch('http://127.0.0.1:8000/api/reservoir/model-retrain/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                setUploadStatus('File uploaded successfully!');
                console.log('Response:', responseData);
            } else {
                const errorData = await response.json();
                setUploadStatus(`Upload failed: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            setUploadStatus(`Error occurred: ${error.message}`);
        }
    };

    return (
        <div>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
            >
                Upload CSV
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileUpload}
                    accept=".csv"
                />
            </Button>

            {/* Display the uploaded file name */}
            {uploadedFile && (
                <div>
                    <p>Uploaded File: {uploadedFile.name}</p>
                </div>
            )}

            {/* Display upload status */}
            {uploadStatus && (
                <div>
                    <p>{uploadStatus}</p>
                </div>
            )}
        </div>
    );
}
