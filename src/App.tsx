/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import CompleteProfile from './pages/CompleteProfile';
import PersonalProfile from './pages/PersonalProfile';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import Login from './pages/Login';
import ContractVerification from './pages/ContractVerification';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SecurityProtocols from './pages/SecurityProtocols';
import TermsOfService from './pages/TermsOfService';
import VerificationProcess from './pages/VerificationProcess';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Requirements from './pages/Requirements';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-inter">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PersonalProfile /></ProtectedRoute>} />
            <Route path="/completar-perfil" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
            <Route path="/requisitos" element={<Requirements />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/sobre-nosotros" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verificacion-contrato" element={<ProtectedRoute><ContractVerification /></ProtectedRoute>} />
            <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
            <Route path="/protocolos-seguridad" element={<SecurityProtocols />} />
            <Route path="/terminos-de-servicio" element={<TermsOfService />} />
            <Route path="/proceso-de-verificacion" element={<VerificationProcess />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

