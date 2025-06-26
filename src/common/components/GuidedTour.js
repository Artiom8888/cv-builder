import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const tourSteps = {
  '/resume': [
    {
      target: '.resume__item-image-section',
      content: 'Upload your profile picture here. Supported formats: JPEG, PNG, GIF. Max size: 5MB.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__item-full-name',
      content: 'Enter your first and last name here.',
      placement: 'bottom',
    },
    {
      target: '.resume__item-job-field',
      content: 'Add your job title or professional designation.',
      placement: 'bottom',
    },
    {
      target: '.resume__navigation',
      content: 'Use these tabs to navigate between different sections of your resume.',
      placement: 'bottom',
    },
    {
      target: '.resume__details-forms',
      content: 'This is where you can add and edit your skills, experience, education, and other details.',
      placement: 'top',
    },
    {
      target: '.resume__input-skills',
      content: 'Type your skills here and press Enter to add them.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__skills-list',
      content: 'Your added skills will appear here. You can adjust their proficiency level using the slider.',
      placement: 'top',
    },

  ],
  '/resume/skills': [
    {
      target: '.resume__input-skills',
      content: 'Type your skills here and press Enter to add them.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__skills-list',
      content: 'Your added skills will appear here. You can adjust their proficiency level using the slider.',
      placement: 'top',
    },
  ],
  '/resume/experience': [
    {
      target: '.resume__experience-section',
      content: 'Add your work experience here. Include job roles, companies, and key responsibilities.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__experience-form',
      content: 'Fill in your job details, including start and end dates, and add your key responsibilities.',
      placement: 'bottom',
    },
  ],
  '/resume/education': [
    {
      target: '.resume__education-section',
      content: 'Add your educational background here. Include institutions, degrees, and dates.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__education-form',
      content: 'Enter your education details, including institution name, degree, and field of study.',
      placement: 'bottom',
    },
  ],
  '/resume/projects': [
    {
      target: '.resume__portfolio-section',
      content: 'Showcase your projects here. Add project details, technologies used, and links.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__portfolio-form',
      content: 'Add project information, including description, technologies, and links to GitHub or live demo.',
      placement: 'bottom',
    },
  ],
  '/resume/languages': [
    {
      target: '.resume__languages-section',
      content: 'Add languages you speak and their proficiency levels.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__languages-form',
      content: 'Enter language details and select your proficiency level for each language.',
      placement: 'bottom',
    },
  ],
  '/resume/contact': [
    {
      target: '.resume__contact-section',
      content: 'Add your contact information here.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.resume__contact-form',
      content: 'Enter your contact details, including LinkedIn, email, and phone number.',
      placement: 'bottom',
    },
  ],
};

const GuidedTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Check if it's the user's first visit
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  useEffect(() => {
    // Update steps when location changes
    const pathSteps = tourSteps[location.pathname];
    if (pathSteps) {
      setSteps(pathSteps);
    }
  }, [location]);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark the tour as completed
      localStorage.setItem('hasSeenTour', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: '#1976d2', // MUI primary color
          zIndex: 10000,
          arrowColor: '#fff',
          backgroundColor: '#fff',
          textColor: '#333',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltip: {
          borderRadius: 4,
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: '#1976d2',
        },
        buttonBack: {
          color: '#1976d2',
        },
        buttonSkip: {
          color: '#666',
        },
      }}
      locale={{
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour; 