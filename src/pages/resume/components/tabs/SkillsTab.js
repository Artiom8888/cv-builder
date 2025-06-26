import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Slider,
  Typography,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSkillLevelLabel } from '../../../../utils/skillUtils';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectSkills,
         addSkill,
         updateSkill,
         removeSkill
} from '../../../../store/slices/skillsSlice';
import { saveResumeDataBySection } from '../../../../store/thunks/resumeThunks';

const SkillPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const SkillsTab = () => {
  const dispatch = useDispatch();
  const [newSkill, setNewSkill] = useState('');
  const skills = useSelector(selectSkills);

  const validateSkillName = (name) => {
    return name.trim().length > 0 && !isDuplicate(name);
  };

  const isDuplicate = (skillName) => {
    return skills.some(skill => skill.name === skillName);
  }

  return (
    <div className='resume__skills-section'>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Skills
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="baseline">
            <Grid item xs>
              <TextField
                fullWidth
                size="small"
                placeholder="Add new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="resume__input-skills"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    !isDuplicate(newSkill) && dispatch(addSkill(newSkill)) 
                    setNewSkill('');
                  }
                }}
                error={!validateSkillName(newSkill)}
                helperText={!validateSkillName(newSkill) && !isDuplicate(newSkill) ? "Please type a skill to activate the button" : isDuplicate(newSkill) ? "A duplicate skill was attempted to be added; please ensure all skills are unique." : ""}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  !isDuplicate(newSkill) && dispatch(addSkill(newSkill))
                  setNewSkill('');
                }}
                disabled={!validateSkillName(newSkill)}
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)'
                  }
                }}
              >
                Add Skill
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box className="resume__skills-list">
          {skills.map((skill) => (
            <SkillPaper key={skill.id} elevation={2}>
              <TextField
                size="small"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => dispatch(updateSkill({ id: skill.id, field:'name', value:e.target.value }))}
                sx={{ flex: 1 }}
                error={!validateSkillName(skill.name) && !isDuplicate(skill.name)}
                helperText={!validateSkillName(skill.name) && !isDuplicate(skill.name) ? "Skill name cannot be empty" : ""}
              />
              <Box sx={{ width: 200 }}>
                <Typography gutterBottom>
                  Level: {getSkillLevelLabel(skill.level)}
                </Typography>
                <Slider
                  value={skill.level}
                  onChange={(e, value) => dispatch(updateSkill({id:skill.id, field:'level', value:value}))}
                  min={0}
                  max={100}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={getSkillLevelLabel}
                />
              </Box>
                <IconButton
                  color="error"
                  onClick={() => dispatch(removeSkill(skill.id))}
                >
                  <DeleteIcon />
                </IconButton>
            </SkillPaper>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(saveResumeDataBySection({sectionName:'skills'}))}
            disabled={skills.some(skill => !validateSkillName(skill.name) && !isDuplicate(skill.name))}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)'
              }
            }}
          >
            Save Skills
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SkillsTab; 