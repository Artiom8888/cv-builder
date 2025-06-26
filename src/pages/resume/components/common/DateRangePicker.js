import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  error,
  helperText
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DatePicker
          label={startLabel}
          value={startDate}
          onChange={onStartDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              error={!!error}
              helperText={helperText}
              InputProps={{
                className: 'resume__item-field',
              }}
            />
          )}
        />
        <DatePicker
          label={endLabel}
          value={endDate}
          onChange={onEndDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              error={!!error}
              helperText={helperText}
              InputProps={{
                className: 'resume__item-field',
              }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker; 