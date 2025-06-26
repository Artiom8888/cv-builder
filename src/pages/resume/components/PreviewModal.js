import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// A4 dimensions in pixels (assuming 96 DPI)
const A4_WIDTH = 794; // 210mm
const A4_HEIGHT = 1123; // 297mm

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    maxWidth: '95vw',
    maxHeight: '95vh',
    margin: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const PreviewContent = styled(Box)(({ theme, scale }) => ({
  position: 'relative',
  backgroundColor: 'white',
  width: A4_WIDTH,
  height: A4_HEIGHT,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[24],
  transformOrigin: 'center',
  transition: 'transform 0.2s ease-in-out',
  overflow: 'hidden',
  transform: `scale(${scale})`,
  '@media print': {
    boxShadow: 'none',
    padding: 0,
    margin: 0,
    width: '210mm',
    height: '297mm',
    transform: 'none',
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  zIndex: 1,
}));

const PreviewModal = ({ open, onClose, children, onDownloadPDF, onDownloadDOCX }) => {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // useEffect(() => {
  //   const calculateScale = () => {
  //     const windowWidth = window.innerWidth;
  //     const windowHeight = window.innerHeight;
      
  //     // Calculate scale based on both width and height
  //     const scaleWidth = (windowWidth * 0.9) / A4_WIDTH;
  //     const scaleHeight = (windowHeight * 0.9) / A4_HEIGHT;
      
  //     // Use the smaller scale to ensure content fits both dimensions
  //     const newScale = Math.min(scaleWidth, scaleHeight);
      
  //     // Set a minimum scale of 0.5 and maximum of 1.5
  //     setScale(Math.max(0.5, Math.min(1.5, newScale)));
  //   };

  //   calculateScale();
  //   window.addEventListener('resize', calculateScale);
    
  //   return () => window.removeEventListener('resize', calculateScale);
  // }, []);

  // const handleZoom = (direction) => {
  //   if (direction === 'in') {
  //     setIsZoomed(!isZoomed);
  //     setScale(prevScale => isZoomed ? 1 : 1.5);
  //   } else if (direction === 'out') {
  //     setIsZoomed(!isZoomed);
  //     setScale(prevScale => isZoomed ? 1 : 0.5);
  //   }
  // };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent>
        <PreviewContent scale={scale}>
          <Controls>
            <Tooltip title="Download PDF">
              <IconButton onClick={onDownloadPDF} color="primary">
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download DOCX">
              <IconButton onClick={onDownloadDOCX} color="primary">
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton onClick={onClose} color="primary">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Controls>
          {children}
        </PreviewContent>
      </DialogContent>
    </StyledDialog>
  );
};

export default PreviewModal; 