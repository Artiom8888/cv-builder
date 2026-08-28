import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech professionals',
    image: '/templates/modern.png',
    category: 'Professional'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Stand out with this unique and creative design',
    image: '/templates/creative.png',
    category: 'Creative'
  },
  {
    id: 'minimal',
    name: 'Minimal Elegance',
    description: 'Simple yet sophisticated design for any industry',
    image: '/templates/minimal.png',
    category: 'Professional'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleTemplateSelect = (templateId) => {
    navigate(`/resume/${templateId}`);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom>
          Create Your Professional Resume
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Choose from our collection of professionally designed templates
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid item key={template.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={template.image}
                alt={template.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Category: {template.category}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  startIcon={<PreviewIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mr: 1 }}
                  onClick={() => setPreviewTemplate(template)}
                >
                  Preview
                </Button>
                <Button
                  startIcon={<CreateIcon />}
                  variant="contained"
                  fullWidth
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Use
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(previewTemplate)}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        aria-labelledby="template-preview-title"
      >
        <DialogTitle id="template-preview-title" sx={{ pr: 6 }}>
          {previewTemplate?.name}
          <IconButton
            aria-label="Close preview"
            onClick={handleClosePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewTemplate && (
            <Box
              component="img"
              src={previewTemplate.image}
              alt={`${previewTemplate.name} template preview`}
              sx={{
                display: 'block',
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Home;