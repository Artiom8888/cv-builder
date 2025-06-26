import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage,
         addLanguage,
         updateLanguage,
         removeLanguage
 } from '../../../../store/slices/languageSlice';
import { saveResumeDataBySection } from '../../../../store/thunks/resumeThunks';
import './LanguagesTab.css'

const LanguagesTab = () => {
  const dispatch = useDispatch();
  const languages = useSelector(selectLanguage);

  const validateField = (value) => {
    return value.trim().length > 0;
  };

  const validateLanguage = (lang) => {
    return validateField(lang.language) && validateField(lang.level);
  };

  const isFormValid = languages.every(validateLanguage);

  return (
    <div className='resume__languages-section'>
      <div className='resume__languages-form'>
        <div className='resume__section-header'>
          <h3>Languages</h3>
        </div>
        {languages.map((lang) => (
          <div key={lang.id} className='resume__language-item'>
            <div className='resume__language-header'>
              <h4>Language {lang.id}</h4>
              {languages.length > 1 && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => dispatch(removeLanguage(lang.id))}
                  size="small"
                >
                  Remove
                </Button>
              )}
            </div>
            <div className='resume__language-content'>
              <TextField
                fullWidth
                size="small"
                placeholder="Language"
                value={lang.language}
                onChange={(e) => dispatch(updateLanguage({id:lang.id, field:'language', value:e.target.value}))}
                sx={{ mb: 2 }}
                error={!validateField(lang.language)}
                helperText={!validateField(lang.language) ? "Language name is required" : ""}
                InputProps={{
                  className: 'resume__language-item',
                }}
              />
              <TextField
                fullWidth
                size="small"
                select
                placeholder="Level"
                value={lang.level}
                onChange={(e) => dispatch(updateLanguage({id:lang.id, field:'level', value:e.target.value}))}
                error={!validateField(lang.level)}
                helperText={!validateField(lang.level) ? "Proficiency level is required" : ""}
                InputProps={{
                  className: 'resume__language-level',
                }}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="">Select Level</option>
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </TextField>
            </div>
          </div>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => dispatch(addLanguage())}
            variant="outlined"
          >
            Add Language
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(saveResumeDataBySection('languages'))}
          >
            Save Languages
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default LanguagesTab; 