import React, { useState } from 'react';
import { Slider, Typography, Box } from '@mui/material';

const ScenarioSlider = () => {
  const [value, setValue] = useState(0);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const getSliderGradient = () => {
    const lightBlue = '#ADD8E6';
    const darkerYellow = '#FFCC00';
    const orange = '#FFA500';
    const red = '#FF0000';
    const darkRed = '#8B0000';

    if (value <= 30) {
      return `linear-gradient(90deg, ${lightBlue} 0%, ${darkerYellow} ${value}%, ${darkerYellow} 100%)`;
    } else if (value > 30 && value <= 75) {
      return `linear-gradient(90deg, ${darkerYellow} 0%, ${orange} ${value}%, ${orange} 100%)`;
    } else if (value > 75 && value <= 150) {
      return `linear-gradient(90deg, ${orange} 0%, ${red} ${value}%, ${red} 100%)`;
    } else {
      return `linear-gradient(90deg, ${red} 0%, ${darkRed} ${value}%, ${darkRed} 100%)`;
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography gutterBottom variant="h6">
      </Typography>
      <Slider
        value={value}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} mm`}
        min={0}
        max={200}
        step={1}
        sx={{
          width: '100%',
          height: 10,
          borderRadius: 5,
          background: getSliderGradient(),
        }}
      />
      <Box sx={{ paddingTop: 2 }}>
        <Typography variant="body1">
          {value <= 30 ? (
            <span style={{ color: '#ADD8E6' }}>Low Rainfall: {value} mm</span>
          ) : value <= 75 ? (
            <span style={{ color: '#FFCC00' }}>Moderate Rainfall: {value} mm</span>
          ) : value <= 150 ? (
            <span style={{ color: '#FFA500' }}>Heavy Rainfall: {value} mm</span>
          ) : (
            <span style={{ color: '#8B0000' }}>Very Heavy Rainfall: {value} mm</span>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default ScenarioSlider;
