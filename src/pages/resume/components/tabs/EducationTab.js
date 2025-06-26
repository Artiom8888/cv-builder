import React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import SchoolIcon from '@mui/icons-material/School';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { selectEducation,
         addEducation,
         updateEducation,
         removeEducation
 } from '../../../../store/slices/educationSlice';
import { saveResumeDataBySection } from '../../../../store/thunks/resumeThunks';
import './EducationTab.css';

const EducationTab = () => {
  const dispatch = useDispatch();
  const education = useSelector(selectEducation);

  const validateField = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (value instanceof dayjs) return true;
    return false;
  };

  const validateEducation = (edu) => {
    return validateField(edu.institution) && 
           validateField(edu.degree) && 
           validateField(edu.field) && 
           validateField(edu.startDate) && 
           validateField(edu.endDate);
  };

  return (
    <div className='resume__education-section'>
    <div className='resume__education-form'>
      <div className='resume__section-header'>
        <h3>Education</h3>
      </div>
      {education.map((edu) => (
        <div key={edu.id} className='resume__education-item'>
          <div className='resume__education-header'>
            <h4>Education {edu.id}</h4>
            {education.length > 1 && (
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => dispatch(removeEducation(edu.id))}
                size="small"
              >
                Remove
              </Button>
            )}
          </div>
          <TextField
            fullWidth
            size="small"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => dispatch(updateEducation({id:edu.id, field:'institution', value:e.target.value}))}
            error={!validateField(edu.institution)}
            helperText={!validateField(edu.institution) ? "Institution name is required" : ""}
            InputProps={{
              className: 'resume__institution-field',
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => dispatch(updateEducation({id:edu.id, field:'degree', value:e.target.value}))}
            error={!validateField(edu.degree)}
            helperText={!validateField(edu.degree) ? "Degree is required" : ""}
            InputProps={{
              className: 'resume__degree-field',
            }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Field of Study"
            value={edu.field}
            onChange={(e) => dispatch(updateEducation({id:edu.id, field:'field', value:e.target.value}))}
            error={!validateField(edu.field)}
            helperText={!validateField(edu.field) ? "Field of study is required" : ""}
            InputProps={{
              className: 'resume__field-of-study',
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker 
                label="Started At" 
                value={edu.startDate ? dayjs(edu.startDate) : null} // Pass Day.js object or null
                className='resume__education-start-date'
                onChange={(newValue) => dispatch(updateEducation({
                  id: edu.id, 
                  field: 'startDate', 
                  value: newValue ? dayjs(newValue).format('YYYY-MM-DD') : '' // Format for storage
                }))}
                slotProps={{
                  textField: {
                    error: !validateField(edu.startDate ? dayjs(edu.startDate) : null), // Validate Day.js object
                    helperText: !validateField(edu.startDate ? dayjs(edu.startDate) : null) ? "Start date is required" : ""
                  }
                }}
              />
              <DatePicker
                label="Ended At"
                value={edu.endDate ? dayjs(edu.endDate) : null} // Pass Day.js object or null
                className='resume__education-end-date'
                onChange={(newValue) => dispatch(updateEducation({
                  id: edu.id, 
                  field: 'endDate', 
                  value: newValue ? dayjs(newValue).format('YYYY-MM-DD') : '' // Format for storage
                }))}
                slotProps={{
                  textField: {
                    error: !validateField(edu.endDate ? dayjs(edu.endDate) : null), // Validate Day.js object
                    helperText: !validateField(edu.endDate ? dayjs(edu.endDate) : null) ? "End date is required" : ""
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => dispatch(addEducation())}
          variant="outlined"
        >
          Add Education
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(saveResumeDataBySection('education'))}
        >
          Save Education
        </Button>
      </Box>
    </div>
  </div>
  );
};

export default EducationTab; 