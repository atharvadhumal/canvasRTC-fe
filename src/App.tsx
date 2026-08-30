import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import  HomePage  from './homepage/HomePage';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { VerifyEmail } from './auth/VerifyEmail';
import { ForgotPassword } from './auth/ForgotPassword';
import { Dashboard } from './dashboard/Dashboard';
import ResetPassword from './auth/ResetPassword';
import { RoomPage } from './room/RoomPage';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center">
        <Oval
          visible={true}
          height="36"
          width="36"
          color="#7c3aed"
          secondaryColor="#211e3b"
          strokeWidth={4}
          strokeWidthSecondary={4}
          ariaLabel="loading"
        />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
