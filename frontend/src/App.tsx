import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index'; // Main page
import Login from './components/Login'; // Login page
import './App.css';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminSetup from './components/AdminSetup';
import CsvTable from './components/dashboard/e-reputation/CsvTable';

const App = () => {
  return (
    <div className="app">
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Define the routes here */}
        <Route path="/" element={<Index />} /> {/* Home page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<AdminSetup />} />
        <Route path="/csv-table" element={<CsvTable  />} />
      </Routes>
    </div>
  );
};

export default App;
