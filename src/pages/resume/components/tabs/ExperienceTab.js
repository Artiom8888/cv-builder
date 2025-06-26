import React from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useSelector, useDispatch } from 'react-redux';
import './ExperienceTab.css';
import { addExperience,
         addScope,
         addResponsibility,
         addTechStack,
         selectExperiences,
         updateExperienceField,
         updateScope,
         updateResponsibility,
         updateNewTechStack,
         removeTechStack,
         removeExperience, 
         removeScope,
         removeResponsibility
      } from '../../../../store/slices/experienceSlice';
import { saveResumeDataBySection } from '../../../../store/thunks/resumeThunks';

const ExperienceTab = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(selectExperiences);

  const validateField = (value) => {
    return value.trim().length > 0;
  };

  const validateExperience = (exp) => {
    return validateField(exp.jobRole) && 
           exp.startDate && 
           exp.endDate && 
           exp.keyResponsibilities?.length > 0 &&
           exp.keyResponsibilities.every(scope => 
             validateField(scope.scope) && 
             scope.techStack.length > 0 &&
             scope.techStack.every(resp => validateField(resp)) &&
             scope.responsibilities.length > 0 &&
             scope.responsibilities.every(resp => validateField(resp))
           );
  };

  const isFormValid = experiences.every(validateExperience);

  return (
    <div className='resume__experience-section'>
      <div className='resume__experience-form'>
        {experiences.map((experience) => (
          <form key={experience.id} className='resume__experience-form-details'> {/*onSubmit={handleSubmit}*/}
            <div className='resume__experience-form-header'>
              <h3>Experience {experience.id}</h3>
              {experiences.length > 1 && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => dispatch(removeExperience(experience.id))}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className='resume__experience-job-role'>
              <div className='resume__experience-job-role-field'>
                <TextField  
                  placeholder='Your job role...'
                  fullWidth
                  sx={{ width: '100%', fontSize: '16px' }}
                  value={experience.jobRole}
                  onChange={(e) => dispatch(updateExperienceField({id:experience.id, field:'jobRole', value:e.target.value}))}
                  error={!validateField(experience.jobRole)}
                  helperText={!validateField(experience.jobRole) ? "Job role is required" : ""}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <DatePicker 
                    label={"Start Date"}
                    value={experience.startDate ? dayjs(experience.startDate) : null}
                    onChange={(newValue) => dispatch(
                      updateExperienceField({
                        id:experience.id, 
                        field:'startDate', 
                        value:newValue ? newValue.format('YYYY-MM-DD') : ''
                      }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: !experience.startDate,
                        helperText: !experience.startDate ? "Start date is required" : " ",
                        sx: { width: '50%' }
                      }
                    }}
                  />
                  <DatePicker
                    label={"End Date"}
                    value={experience.endDate ? dayjs(experience.endDate) : null}
                    onChange={(newValue) => dispatch(
                      updateExperienceField({
                        id:experience.id, 
                        field:'endDate', 
                        value:newValue ? newValue.format('YYYY-MM-DD') : ''
                      }))}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: !experience.endDate,
                        helperText: !experience.endDate ? "End date is required" : " ",
                        sx: { width: '50%' }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </div>

            <div className='resume__experience-job-role-details'>
              <div className='responsibilities-section'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <h4>Engagements</h4>
                  <Tooltip title="Add New Scope">
                    <IconButton
                      color="primary"
                      onClick={() => dispatch(addScope(experience.id))}
                      size="small"
                      sx={{ 
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white'
                        }
                      }}
                    >
                      <AddBoxOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {experience.keyResponsibilities?.map((scope, scopeIndex) => (
                  <Box 
                    key={scopeIndex} 
                    sx={{ 
                      mb: 3,
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Enter the name of the project you contributed to"
                        value={scope.scope}
                        onChange={(e) => dispatch(updateScope({experienceId: experience.id, scopeIndex: scopeIndex, value: e.target.value}))}
                        sx={{ flex: 1 }}
                        error={!validateField(scope.scope)}
                        helperText={!validateField(scope.scope) ? "Scope name is required" : ""}
                      />
                      {experience.keyResponsibilities.length > 1 && (
                        <Tooltip title="Remove Scope">
                          <IconButton
                            color="error"
                            onClick={() => dispatch(removeScope({experienceId:experience.id, scopeIndex:scopeIndex}))}
                            size="small"
                            sx={{ 
                              backgroundColor: 'error.light',
                              '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white'
                              }
                            }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    <div className='tech-stack-section'>
                      <h4>Tech Stack</h4>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {scope.techStack.map((tech, index) => (
                          <Chip
                            key={index}
                            label={tech}
                            onDelete={() => dispatch(removeTechStack({experienceId:experience.id, scopeIndex:scopeIndex, techToRemove:tech}))}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      {/* {scope.techStack.map((techStack, techStackIndex) => ( */}
                        <div className='tech-stack-input'>
                          <TextField
                            size="small"
                            placeholder="Add technology..."
                            value={scope.newTechStack}
                            onChange={(e) => dispatch(updateNewTechStack({experienceId:experience.id, scopeIndex:scopeIndex, value:e.target.value}))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                dispatch(addTechStack({experienceId:experience.id, scopeIndex:scopeIndex}));
                              }
                            }}
                            error={!validateField(scope.newTechStack)}
                            helperText={!validateField(scope.newTechStack) ? "Please enter a technology" : ""}
                          />
                          <Button
                            variant="contained"
                            onClick={() => dispatch(addTechStack({experienceId:experience.id, scopeIndex:scopeIndex}))}
                            disabled={!validateField(scope.newTechStack)}
                            sx={{
                              '&.Mui-disabled': {
                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      {/* ))} */}
                    </div>
                    <Box sx={{ pl: 2 }}>
                      {scope.responsibilities.map((responsibility, respIndex) => (
                        <Box 
                          key={respIndex} 
                          sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            mb: 1, 
                            alignItems: 'center',
                            '&:last-child': { mb: 0 }
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Add responsibility..."
                            value={responsibility}
                            onChange={(e) => dispatch(updateResponsibility({experienceId:experience.id, scopeIndex:scopeIndex, responsibilityIndex:respIndex, value:e.target.value}))}
                            sx={{ flex: 1 }}
                            error={!validateField(responsibility)}
                            helperText={!validateField(responsibility) ? "Responsibility cannot be empty" : ""}
                          />
                          {scope.responsibilities.length > 1 && (
                            <Tooltip title="Remove Responsibility">
                              <IconButton
                                color="error"
                                onClick={() => dispatch(removeResponsibility({experienceId:experience.id, scopeIndex:scopeIndex, responsibilityIndex:respIndex}))}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'error.light',
                                  '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      ))}
                      
                      <Tooltip title="Add Responsibility">
                        <IconButton
                          color="primary"
                          onClick={() => dispatch(addResponsibility({experienceId:experience.id, scopeIndex:scopeIndex}))}
                          size="small"
                          sx={{ 
                            mt: 1,
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </div>
            </div>
          </form>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => dispatch(addExperience())}
            variant="outlined"
          >
            Add Experience
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(saveResumeDataBySection('experience'))}
            disabled={!isFormValid}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)'
              }
            }}
          >
            Save Experience
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default ExperienceTab; 