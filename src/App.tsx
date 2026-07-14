import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingDashboard from './pages/LandingDashboard';
import CourseWorkspace from './pages/CourseWorkspace';
import ModuleViewer from './pages/ModuleViewer';
import InstructorDashboard from './pages/InstructorDashboard'; // Import Halaman Baru Admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Sisi Siswa / Peserta */}
        <Route path="/" element={<LandingDashboard />} />
        <Route path="/course/:id" element={<CourseWorkspace />} />
        <Route path="/course/:id/modul/:modulId" element={<ModuleViewer />} />
        
        {/* Rute Sisi Instruktur / Admin Lemdiklat */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;