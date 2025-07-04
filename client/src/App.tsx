import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import context
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuditPage from './pages/AuditPage';
import SignDocument from './pages/SignDocument';
import SigningPage from './pages/SigningPage';
import SignatureDemoPage from './pages/SignatureDemoPage';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/sign" element={<SignDocument />} />
              <Route path="/sign/:documentId" element={
                <ProtectedRoute>
                  <SigningPage />
                </ProtectedRoute>
              } />
              <Route path="/demo" element={<SignatureDemoPage />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
