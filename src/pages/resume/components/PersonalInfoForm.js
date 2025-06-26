import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { selectPersonalInfo,
         updatePersonalInfo,
         setPhoto
 } from '../../../store/slices/personalInfoSlice';

import './PersonalInfoForm.css';

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const PersonalInfoForm = () => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const personalInfo = useSelector(selectPersonalInfo);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Invalid file type. Please upload an image file.' }));
      return;
    }
  
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, image: 'File too large. Maximum size is 5MB.' }));
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(setPhoto(reader.result))
      setErrors(prev => ({ ...prev, image: null }));
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, image: 'Error reading file.' }));
    };
    reader.readAsDataURL(file);
  };


  const validateField = (value) => {
    return value && value.trim().length > 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const isFormValid = validateField(personalInfo.firstName) &&
                     validateField(personalInfo.lastName) &&
                     validateField(personalInfo.jobTitle) &&
                     validateEmail(personalInfo.email) &&
                     validatePhone(personalInfo.phone) &&
                     validateField(personalInfo.location);

  return (
    <div className='resume__personal-info'>
      <div className='resume__personal-info-section'>
        <form  className='resume__personal-info-form'> {/*onSubmit={handleSubmit}*/}
          <div className='resume__personal-info-image-section'>
            <Avatar 
              src={personalInfo.photo || ''} 
              variant='rounded'
              sx={{ 
                width: 150, 
                height: 200,
                '& img': {
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  padding: 0,
                  margin: 0
                }
              }}
              alt="Photo"
            />
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              size="medium"
              aria-label='Upload profile picture'
              sx={{ mt: 1 }}
            >
              Upload image
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageUpload}
                accept={ALLOWED_FILE_TYPES.join('.')}
                aria-label='Profile picture upload'
              />
            </Button>
            {errors.image && <span className='error-message'>{errors.image}</span>}
          </div>

          <div className='resume__personal-info-full-name' >
            <TextField  
              size='medium'
              fullWidth={true}
              placeholder='First Name'
              value={personalInfo.firstName}
              onChange={(e) => dispatch(updatePersonalInfo({field:'firstName', value: e.target.value}))}
              InputProps={{
                className:'resume__personal-info-first-name',
              }}
            />
            <TextField  
              size='medium'
              fullWidth={true}
              placeholder='Last Name'
              value={personalInfo.lastName}
              onChange={(e) => dispatch(updatePersonalInfo({field:'lastName', value: e.target.value}))}
              InputProps={{
                className:'resume__personal-info-last-name',
              }}
            />
          </div>

          <TextField  
            size='medium'
            fullWidth={true}
            placeholder='Job Title'
            value={personalInfo.jobTitle}
            onChange={(e) => dispatch(updatePersonalInfo({field:'jobTitle', value:e.target.value}))}
            InputProps={{
              className:'resume__personal-info-job-field',
            }}
            sx={{ mt: 1 }}
          />

          <Box sx={{ mt: 2 }}>
            <TextField
              size='medium'
              fullWidth={true}
              placeholder='Email'
              value={personalInfo.email}
              error={!validateEmail(personalInfo.email)}
              helperText={!validateEmail(personalInfo.email) ? "Please enter a valid email address" : ""}
              onChange={(e) => dispatch(updatePersonalInfo({field:'email', value: e.target.value}))}
              InputProps={{
                className:"resume__personal-info-email",
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <TextField
              size='medium'
              fullWidth={true}
              placeholder='Phone'
              value={personalInfo.phone}
              error={!validatePhone(personalInfo.phone)}
              helperText={!validatePhone(personalInfo.phone) ? "Please enter a valid phone number" : ""}
              onChange={(e) => dispatch(updatePersonalInfo({field:'phone', value: e.target.value}))}
              InputProps={{
                className:"resume__personal-info-phone",
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <TextField
              size='medium'
              fullWidth={true}
              placeholder='LinkedIn URL'
              value={personalInfo.linkedin}
              onChange={(e) => dispatch(updatePersonalInfo({field:'linkedin', value: e.target.value}))}
              InputProps={{
                className:"resume__personal-info-linkedIn",
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedInIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfoForm;
