import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {BASE_URL} from '../Config.js'

export default function RangeSlider({
    marks,
    defaultValue,
    step,
    min,
    max,
    value,
    onChange,
    valueLabelDisplay = "auto",
    ariaLabel = "Custom marks"
}) {
    return (
        <Box sx={{ width: 450 }}>
            <Slider
                aria-label={ariaLabel}
                value={value}
                defaultValue={defaultValue}
                step={step}
                min={min}
                max={max}
                marks={marks}
                valueLabelDisplay={valueLabelDisplay}
                onChange={(event, newValue) => onChange(newValue)}
                // Custom styling for valueLabel and marks
                valueLabelStyle={{ color: 'white' }} // Make the value label white
                markLabelStyle={{ color: 'white' }}   // Make the marks labels white
                sx={{
                    '& .MuiSlider-valueLabel': {
                        color: 'white', // This sets the value label color
                    },
                    '& .MuiSlider-markLabel': {
                        color: 'white', // This sets the mark labels color
                    }
                }}
            />
        </Box>
    );
}
