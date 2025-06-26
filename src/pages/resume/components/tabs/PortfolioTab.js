import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject,
         addProject,
         addTechnology,
         removeProject,
         removeTechnology,
         updateProject,
         uploadProjectImage
 } from '../../../../store/slices/projectsSlice';
import { saveResumeDataBySection } from '../../../../store/thunks/resumeThunks';
import './PortfolioTab.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

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

const PortfolioTab = () => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const projects = useSelector(selectProject);

  const validateField = (value) => {
    return value.trim().length > 0;
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleProjectImageUpload = (projectId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, [`projectImage_${projectId}`]: 'Invalid file type. Please upload an image file.' }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [`projectImage_${projectId}`]: 'File too large. Maximum size is 5MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(uploadProjectImage({projectId:projectId, image:reader.result}))
      setErrors(prev => ({ ...prev, [`projectImage_${projectId}`]: null }));
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, [`projectImage_${projectId}`]: 'Error reading file.' }));
    };
    reader.readAsDataURL(file);
  };

  const validatePortfolio = (project) => {
    return validateField(project.name) && 
           validateField(project.description) && 
           validateUrl(project.githubLink) &&
           validateUrl(project.demoUrl);
  };

  const isFormValid = projects.every(validatePortfolio);

  return (
    <div className='resume__portfolio-section'>
    <div className='resume__portfolio-form'>
      {projects.map((project) => (
        <div key={project.id} className='resume__portfolio-item'>
          <div className='resume__portfolio-header'>
            <h3>Project {project.id}</h3>
            {projects.length > 1 && (
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => dispatch(removeProject(project.id))}
              >
                Remove
              </Button>
            )}
          </div>

          <div className='resume__portfolio-content'>
            <div className='resume__portfolio-image-section'>
              <Avatar 
                src={project.image || ''} 
                variant='rounded'
                sx={{ 
                  width: 200, 
                  height: 150,
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    margin: 0
                  }
                }}
                alt={`Project ${project.id}`}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                size="medium"
                aria-label='Upload project image'
                sx={{ mt: 1 }}
              >
                Upload Project Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleProjectImageUpload(project.id, e)}
                  accept={ALLOWED_FILE_TYPES.join('.')}
                  aria-label='Project image upload'
                />
              </Button>
              {errors[`projectImage_${project.id}`] && (
                <span className='error-message'>{errors[`projectImage_${project.id}`]}</span>
              )}
            </div>

            <div className='resume__portfolio-details'>
              <TextField
                fullWidth
                size="medium"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => dispatch(updateProject({id:project.id, field:'name', value:e.target.value}))}
                sx={{ mb: 2 }}
                error={!validateField(project.name)}
                helperText={!validateField(project.name) ? "Project name is required" : ""}
                InputProps={{
                  className: 'resume__portfolio-project-name',
                }}
              />

              <TextField
                fullWidth
                size="medium"
                multiline
                rows={3}
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => dispatch(updateProject({id:project.id, field:'description', value:e.target.value}))}
                sx={{ mb: 2 }}
                error={!validateField(project.description)}
                helperText={!validateField(project.description) ? "Project description is required" : ""}
                InputProps={{
                  className: 'resume__portfolio-project-description',
                }}
              />

              <div className='tech-stack-section'>
                <h4>Technologies Used</h4>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {project.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => dispatch(removeTechnology({projectId:project.id, techToRemove:tech}))}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <div className='tech-stack-input'>
                  <TextField
                    size="small"
                    placeholder="Add technology..."
                    value={project.newTechnology}
                    onChange={(e) => dispatch(updateProject({id:project.id, field:'newTechnology', value:e.target.value}))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        dispatch(addTechnology({projectId:project.id, technology: e.target.value }));
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      const technology = project.newTechnology.trim();
                      if (technology) {
                        dispatch(addTechnology({projectId:project.id, technology: technology }))
                      }
                    }}
                    disabled={!project.newTechnology.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className='resume__portfolio-links'>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="GitHub URL"
                  value={project.githubUrl}
                  onChange={(e) => dispatch(updateProject({id:project.id, field:'githubUrl', value:e.target.value}))}
                  error={!validateUrl(project.githubUrl)}
                  helperText={!validateUrl(project.githubUrl) ? "Please enter a valid URL" : ""}
                  InputProps={{
                    className:'resume__portfolio-github',
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHubIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Live Demo URL"
                  value={project.liveDemoUrl}
                  onChange={(e) => dispatch(updateProject({id:project.id, field:'liveDemoUrl', value:e.target.value}))}
                  error={!validateUrl(project.liveDemoUrl)}
                  helperText={!validateUrl(project.liveDemoUrl) ? "Please enter a valid URL" : ""}
                  InputProps={{
                    className:'resume__portfolio-demo-url',
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => dispatch(addProject())}
          variant="outlined"
        >
          Add Project
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(saveResumeDataBySection('portfolio'))}
        >
          Save Portfolio
        </Button>
      </Box>
    </div>
  </div>);
};

export default PortfolioTab; 