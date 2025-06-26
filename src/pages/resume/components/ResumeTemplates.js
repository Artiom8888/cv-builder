import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';

const templates = {
  modern: {
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech professionals',
    layout: 'modern',
    category: 'Professional'
  },
  creative: {
    name: 'Creative Portfolio',
    description: 'Stand out with this unique and creative design',
    layout: 'creative',
    category: 'Creative'
  },
  minimal: {
    name: 'Minimal Elegance',
    description: 'Simple yet sophisticated design for any industry',
    layout: 'minimal',
    category: 'Professional'
  }
};

const ResumeTemplates = ({ onTemplateSelect }) => {
  const location = useLocation();
  const theme = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get('template');
    
    if (templateId && templates[templateId]) {
      setSelectedTemplate(templateId);
      onTemplateSelect?.(templateId);
      setToastMessage(`You've selected the ${templates[templateId].name} template`);
      setShowToast(true);
    }
  }, [location, onTemplateSelect]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Resume Template
      </Typography>
      {selectedTemplate ? (
        <Paper 
          elevation={2}
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Typography variant="h5" gutterBottom>
            {templates[selectedTemplate].name}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {templates[selectedTemplate].description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Category: {templates[selectedTemplate].category}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(templates).map(([id, template]) => (
            <Grid item key={id} xs={12} sm={6} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
                onClick={() => {
                  setSelectedTemplate(id);
                  onTemplateSelect?.(id);
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Category: {template.category}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeTemplates;