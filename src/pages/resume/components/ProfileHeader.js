import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { styled } from '@mui/material/styles';

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

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ProfileHeader = ({ 
  image, 
  formData, 
  errors, 
  onImageUpload, 
  onInputChange, 
  onSubmit 
}) => {
  return (
    <div className='resume__item'>
      <div className='resume__item-header'>
        <Button
          startIcon={<PreviewIcon />}
          variant="text"
          size="large"
          aria-label="Preview resume"
        >
          Preview
        </Button>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="text"
          size="large"
          aria-label="Download resume"
        >
          Download
        </Button>
      </div>
      
      <form onSubmit={onSubmit} className='resume__item-form'>
        <div className='resume__item-image-section'>
          <Avatar 
            src={image || ''} 
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
            alt="Profile"
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
              onChange={onImageUpload}
              accept={ALLOWED_FILE_TYPES.join('.')}
              aria-label='Profile picture upload'
            />
          </Button>
          {errors.image && <span className='error-message'>{errors.image}</span>}
        </div>

        <div className='resume__item-full-name' style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <TextField  
            size='medium'
            fullWidth={true}
            placeholder='First Name'
            value={formData.firstName}
            onChange={onInputChange('firstName')}
            InputProps={{
              className:'resume__item-field',
            }}
          />
          <TextField  
            size='medium'
            fullWidth={true}
            placeholder='Last Name'
            value={formData.lastName}
            onChange={onInputChange('lastName')}
            InputProps={{
              className:'resume__item-field',
            }}
          />
        </div>

        <TextField  
          size='medium'
          fullWidth={true}
          placeholder='Job Title'
          value={formData.jobTitle}
          onChange={onInputChange('jobTitle')}
          InputProps={{
            className:'resume__item-field',
          }}
          sx={{ mt: 1 }}
        />

        <div className='resume__item-buttons' style={{ marginTop: '8px' }}>
          <Button 
            type='submit' 
            size='medium'
            variant="contained"
            fullWidth
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileHeader; 