import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ImageUpload = ({
  image,
  onImageUpload,
  error,
  avatarSize = { width: 150, height: 200 },
  buttonText = 'Upload image',
  buttonSize = 'medium'
}) => {
  return (
    <div className='image-upload-section'>
      <Avatar 
        src={image || ''} 
        variant='rounded'
        sx={{ 
          width: avatarSize.width, 
          height: avatarSize.height,
          '& img': {
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            padding: 0,
            margin: 0
          }
        }}
        alt="Uploaded"
      />
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        size={buttonSize}
        aria-label='Upload image'
        sx={{ mt: 1 }}
      >
        {buttonText}
        <VisuallyHiddenInput
          type="file"
          onChange={onImageUpload}
          accept={ALLOWED_FILE_TYPES.join('.')}
          aria-label='Image upload'
        />
      </Button>
      {error && <span className='error-message'>{error}</span>}
    </div>
  );
};

export default ImageUpload; 