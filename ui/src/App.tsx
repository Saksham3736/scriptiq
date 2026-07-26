/* App.tsx — ScriptIQ Main Application Routing */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './app/providers';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import AppShell from './components/layout/AppShell';
import DoctorConsolePage from './pages/DoctorConsolePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import PrescriptionViewPage from './pages/PrescriptionViewPage';
import ReceiptViewPage from './pages/ReceiptViewPage';
import PatientsPage from './pages/PatientsPage';
import SettingsPage from './pages/SettingsPage';
import PatientPortal from './pages/PatientPortal';
import PatientLoginPage from './pages/patient/PatientLoginPage';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';

import RequireRole from './components/auth/RequireRole';

export default function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <BrowserRouter>
        <Routes>
          {/* Public Patient Views */}
          <Route path="/prescription/:prescriptionId" element={<PrescriptionViewPage />} />
          <Route path="/p/:shareToken" element={<PrescriptionViewPage />} />
          <Route path="/receipt/:orderId" element={<ReceiptViewPage />} />
          <Route path="/patient" element={<PatientPortal />} />
          <Route path="/patient/login" element={<PatientLoginPage />} />
          <Route path="/patient/dashboard" element={<PatientDashboardPage />} />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Doctor & Admin Layout */}
          <Route element={<AppShell />}>
            <Route element={<RequireRole allowedRoles={['doctor', 'admin']} />}>
              <Route path="/console" element={<DoctorConsolePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/console" replace />} />
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </Providers>
  );
}
