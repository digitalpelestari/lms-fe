import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingDashboard from './pages/LandingDashboard';
import ModuleViewer from './pages/ModuleViewer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';

import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import ManageCourse from './pages/ManageCourse';
import BulkRegister from './pages/BulkRegister';

import SuperAdminLogin from './pages/SuperAdminLogin';
import ManageInstructors from './pages/ManageInstructors';
import ProtectedRoute from './components/ProtectedRoute';

export function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />

        {/* Siswa / Pelajar */}
        <Route path="/" element={<LandingDashboard />} />
        <Route element={<ProtectedRoute allowedRoles={['pelajar', 'admin']} redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/change-password" element={<ChangePassword />} />
          <Route path="/course/:id" element={<ModuleViewer />} />
        </Route>

        {/* Instruktur & Admin */}
        <Route element={<ProtectedRoute allowedRoles={['instruktur', 'admin']} redirectTo="/login" />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/create-course" element={<CreateCourse />} />
          <Route path="/instructor/manage-course/:id" element={<ManageCourse />} />
          <Route path="/instructor/register-bulk" element={<BulkRegister />} />
        </Route>

        {/* Khusus Admin (Superadmin) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/superadmin/login" />}>
          <Route path="/superadmin/dashboard" element={<InstructorDashboard />} />
          <Route path="/superadmin/instructors" element={<ManageInstructors />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;