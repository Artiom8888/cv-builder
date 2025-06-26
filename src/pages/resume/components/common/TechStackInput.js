import React from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const TechStackInput = ({
  value,
  onChange,
  label = 'Technologies (comma-separated)',
  placeholder = 'e.g., React, Node.js, MongoDB',
  error,
  helperText
}) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={!!error}
        helperText={helperText}
        InputProps={{
          className: 'resume__item-field',
        }}
      />
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {value.split(',').map((tech, index) => (
          tech.trim() && (
            <Chip
              key={index}
              label={tech.trim()}
              size="small"
              variant="outlined"
            />
          )
        ))}
      </Box>
    </Box>
  );
};

export default TechStackInput; 