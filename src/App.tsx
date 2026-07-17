import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingDashboard from './pages/LandingDashboard';
import ModuleViewer from './pages/ModuleViewer';
import InstructorDashboard from './pages/InstructorDashboard'; // Import Halaman Baru Admin
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import ManageCourse from './pages/ManageCourse';
import BulkRegister from './pages/BulkRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rute Sisi Siswa / Peserta */}
        <Route path="/" element={<LandingDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<ModuleViewer />} />
        

        {/* Rute Sisi Instruktur / Admin Lemdiklat */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/create-course" element={<CreateCourse />} />
        <Route path="/instructor/manage-course/:id" element={<ManageCourse />} />
        <Route path="/instructor/register-bulk" element={<BulkRegister />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;