import React, {useState, useEffect} from 'react';
import PreviewIcon from '@mui/icons-material/Preview';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SkillsTab from './components/tabs/SkillsTab';
import ExperienceTab from './components/tabs/ExperienceTab';
import EducationTab from './components/tabs/EducationTab';
import PersonalInfoForm from './components/PersonalInfoForm';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PreviewModal from './components/PreviewModal';
import ResumePreview from './components/ResumePreview';
import resumeApi from '../../backend/api';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import PortfolioTab from './components/tabs/PortfolioTab';
import LanguagesTab from './components/tabs/LanguagesTab';
import './ResumeEditor.css';
import { useSelector } from 'react-redux';
import { selectExperiences } from '../../store/slices/experienceSlice';
import { selectLanguage } from '../../store/slices/languageSlice';
import { selectEducation } from '../../store/slices/educationSlice';
import { selectProject } from '../../store/slices/projectsSlice';
import { selectPersonalInfo } from '../../store/slices/personalInfoSlice';
import { selectSkills } from '../../store/slices/skillsSlice';

const ResumeEditor = () => {
  const navigate = useNavigate();
  const experiences = useSelector(selectExperiences);
  const languages = useSelector(selectLanguage);
  const education = useSelector(selectEducation);
  const projects = useSelector(selectProject);
  const personalInfo = useSelector(selectPersonalInfo);
  const skills = useSelector(selectSkills);
  const { templateId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [hasPreviewed, setHasPreviewed] = useState(false);

  // Map tab indices to their corresponding paths
  const tabPaths = [
    'skills',
    'experience',
    'portfolio',
    'education',
    'languages',
    'contact'
  ];

  // Update active tab based on URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const tabIndex = tabPaths.indexOf(path);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [location.pathname]);

  // // Add auto-save timer
  // useEffect(() => {
  //   let timer;
  //   if (hasChanges && !isSaving) {
  //     timer = setTimeout(() => {
  //       handleSaveTabData(activeTab);
  //     }, 2000); // Auto-save after 2 seconds of inactivity
  //   }
  //   return () => clearTimeout(timer);
  // }, [hasChanges, activeTab]);

  // Track changes
  // useEffect(() => {
  //   setHasChanges(true);
  // }, [personalInfo, education, experiences, projects, languages, skills]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const tabPath = tabPaths[newValue];
    navigate(`/resume/${templateId}/${tabPath}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
    setHasPreviewed(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
  };

  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!resumeId) {
        alert('Please save your resume first');
        return;
      }
      if (!hasPreviewed) {
        alert('Please preview your resume before downloading');
        return;
      }
      await resumeApi.downloadPDF(resumeId);
      handleDownloadClose();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleDownloadDOCX = async () => {
    try {
      if (!resumeId) {
        alert('Please save your resume first');
        return;
      }
      if (!hasPreviewed) {
        alert('Please preview your resume before downloading');
        return;
      }
      await resumeApi.downloadDOCX(resumeId);
      handleDownloadClose();
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      alert('Failed to download DOCX. Please try again.');
    }
  };

  return (
    <div className='resume'>
      <div className='resume__main-header'>
        <div className='resume__main-header-left'>
          <Button
            startIcon={<HomeIcon />}
            variant="text"
            size="large"
            aria-label="Back to home"
            onClick={handleBackToHome}
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Resume Builder
          </Typography>
          {isSaving && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>Saving...</Typography>
            </Box>
          )}
          {lastSaved && !isSaving && (
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </Typography>
          )}
        </div>
        
        <div className='resume__main-header-right'>
          <Button
            startIcon={<PreviewIcon />}
            variant="contained"
            size="large"
            aria-label="Preview resume"
            onClick={handlePreviewClick}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Tooltip title={!hasPreviewed ? "Please preview your resume before downloading" : "Download your resume"}>
            <span>
              <Button
                startIcon={<FileDownloadIcon />}
                variant="contained"
                size="large"
                aria-label="Download resume"
                onClick={handleDownloadClick}
                disabled={!hasPreviewed}
                sx={{ mr: 2 }}
              >
                Download
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>

      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleDownloadClose}
      >
        <MenuItem onClick={handleDownloadPDF}>
          <PictureAsPdfIcon sx={{ mr: 1 }} />
          Download as PDF
        </MenuItem>
        <MenuItem onClick={handleDownloadDOCX}>
          <DescriptionIcon sx={{ mr: 1 }} />
          Download as DOCX
        </MenuItem>
      </Menu>

      <div className='resume__content'>
        <PersonalInfoForm />
        <div className='resume__tabs-wrapper'>
          <div className='resume__navigation'>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab 
                icon={<PsychologyIcon />} 
                label="Skills" 
                iconPosition="start"
              />
              <Tab 
                icon={<WorkIcon />} 
                label="Experience" 
                iconPosition="start"
              />
              <Tab 
                icon={<CodeIcon />} 
                label="Portfolio" 
                iconPosition="start"
              />
              <Tab 
                icon={<SchoolIcon />} 
                label="Education" 
                iconPosition="start"
              />
              <Tab 
                icon={<TranslateIcon />} 
                label="Languages" 
                iconPosition="start"
              />
            </Tabs>
          </div>
          <div className='resume__details-forms'>
            {activeTab === 0 && (
              <SkillsTab />
            )}
            {activeTab === 1 && (
              <ExperienceTab />
            )}
            {activeTab === 2 && (
              <PortfolioTab />
            )}
            {activeTab === 3 && (
              <EducationTab />
            )}
            {activeTab === 4 && (
              <LanguagesTab  />
            )}
          </div>
        </div>
      </div>

      <PreviewModal
        open={isPreviewOpen}
        onClose={handlePreviewClose}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDOCX={handleDownloadDOCX}
      >
        <ResumePreview />
      </PreviewModal>
    </div>
  )
};

export default ResumeEditor;