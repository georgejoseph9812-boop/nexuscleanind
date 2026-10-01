import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WasteAwarenessPage } from './pages/WasteAwarenessPage';

// Citizen Pages
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';
import { ReportWastePage } from './pages/citizen/ReportWastePage';
import { WastePickupPage } from './pages/citizen/WastePickupPage';
import { MyComplaintsPage } from './pages/citizen/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/citizen/ComplaintDetailPage';
import { EcoScorePage } from './pages/citizen/EcoScorePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { PredictiveIntelligencePage } from './pages/admin/PredictiveIntelligencePage';
import { SmartPickupPage } from './pages/admin/SmartPickupPage';
import { ResolutionVerificationPage } from './pages/admin/ResolutionVerificationPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Layout Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/awareness" element={<WasteAwarenessPage />} />
          </Route>

          {/* Citizen Portal Routes */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<CitizenDashboardPage />} />
            <Route path="report" element={<ReportWastePage />} />
            <Route path="pickup" element={<WastePickupPage />} />
            <Route path="complaints" element={<MyComplaintsPage />} />
            <Route path="complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="eco-score" element={<EcoScorePage />} />
          </Route>

          {/* Admin Operations Intelligence Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="predictive" element={<PredictiveIntelligencePage />} />
            <Route path="smart-pickup" element={<SmartPickupPage />} />
            <Route path="verification" element={<ResolutionVerificationPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
