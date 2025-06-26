import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Auth from './pages/auth/Auth';
import ResumeEditor from './pages/resume/ResumeEditor';
import GuidedTour from './common/components/GuidedTour';

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <GuidedTour />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume">
          <Route index element={<ResumeEditor />} />
          <Route path=":templateId" element={<ResumeEditor />} />
          <Route path=":templateId/skills" element={<ResumeEditor />} />
          <Route path=":templateId/experience" element={<ResumeEditor />} />
          <Route path=":templateId/portfolio" element={<ResumeEditor />} />
          <Route path=":templateId/education" element={<ResumeEditor />} />
          <Route path=":templateId/languages" element={<ResumeEditor />} />
          <Route path=":templateId/contact" element={<ResumeEditor />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
